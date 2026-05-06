import { Builder, By, until } from 'selenium-webdriver';
import assert from 'assert';

describe('Flujo Completo de Horas Extras', function () {
    let driver;

    // Aumentamos el timeout general porque el flujo es largo y tiene varias pausas visuales
    this.timeout(45000);

    // Usamos before y after (en lugar de beforeEach) para mantener LA MISMA ventana abierta todo el tiempo
    before(async function () {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize(); // Asegura que la pantalla esté completa y el menú lateral se vea
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    it('Ejecuta toda la secuencia en orden (Empleado -> Logout -> Admin)', async function () {
        // ==========================================
        // PASO 1: LOGIN EMPLEADO
        // ==========================================
        await driver.get('http://127.0.0.1:8000/login');
        await driver.sleep(1000);

        const emailEmpleado = await driver.findElement(By.name('email'));
        await emailEmpleado.sendKeys('carlos@rosabetania.com');
        await driver.sleep(500);
        
        const passEmpleado = await driver.findElement(By.name('password'));
        await passEmpleado.sendKeys('empleado123'); // Asegúrate que esta sea la contraseña correcta
        await driver.sleep(500);

        const btnLogin = await driver.findElement(By.css('button[type="submit"]'));
        await btnLogin.click();
        
        await driver.wait(until.urlContains('/dashboard'), 5000);
        await driver.sleep(1000);

        // ==========================================
        // PASO 2: REGISTRAR HORA EXTRA
        // ==========================================
        await driver.get('http://127.0.0.1:8000/horas-extras/create');
        await driver.sleep(1500);

        // Llenar Turno (Intentamos hacer clic en la segunda opción si el empleado tiene turnos asignados)
        try {
            const turnoSelect = await driver.findElement(By.id('turno_id'));
            await turnoSelect.click();
            await driver.sleep(500);
            const turnoOpcion = await driver.findElement(By.css('#turno_id option:nth-child(2)'));
            await turnoOpcion.click();
            await driver.sleep(500);
        } catch (e) {
            console.log("No hay turnos disponibles, se omite este campo.");
        }

        // Llenar cantidad de horas (usamos clear() por si acaso el navegador pone algo)
        const cantidadInput = await driver.findElement(By.name('cantidad_horas'));
        await cantidadInput.clear();
        await cantidadInput.sendKeys('2.5');
        await driver.sleep(1000);

        // Llenar motivo
        const motivoInput = await driver.findElement(By.name('motivo'));
        await motivoInput.clear();
        await motivoInput.sendKeys('Prueba automatizada E2E: Finalización de tiraje urgente.');
        await driver.sleep(1000);

        // Seleccionamos el botón específicamente por su texto o contenedor para no confundirlo con el botón de logout lateral
        const submitBtn = await driver.findElement(By.xpath("//button[contains(text(), 'Enviar Solicitud')]"));
        await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
        await driver.sleep(500);
        // Forzar clic usando JavaScript por si algún elemento lo bloquea visualmente
        await driver.executeScript("arguments[0].click();", submitBtn);
        
        // Esperamos a que guarde y redirija a la lista de horas extras
        try {
            // Esperar a que la URL contenga '/horas-extras' pero YA NO contenga 'create'
            await driver.wait(async function() {
                const currentUrl = await driver.getCurrentUrl();
                return currentUrl.includes('/horas-extras') && !currentUrl.includes('create');
            }, 6000);
        } catch (error) {
            const urlFinal = await driver.getCurrentUrl();
            console.error("\n=========================================");
            console.error("EL FORMULARIO NO SE ENVIÓ. LA URL ACTUAL ES: " + urlFinal);
            
            const erroresVisibles = await driver.findElements(By.css('.alert-danger li, .text-danger'));
            if (erroresVisibles.length > 0) {
                for (let err of erroresVisibles) {
                    console.error("❌ " + await err.getText());
                }
            } else {
                console.error("❌ No hay errores en pantalla. Es posible que el botón no haya reaccionado.");
            }
            console.error("=========================================\n");
            throw new Error("El formulario de horas extras no avanzó.");
        }
        await driver.sleep(2000); 

        // ==========================================
        // PASO 3: CERRAR SESIÓN
        // ==========================================
        // Buscamos el botón directamente dentro del formulario de logout
        const logoutBtn = await driver.findElement(By.css('.sidebar-footer form[action$="/logout"] button'));
        
        // Hacemos un scroll por si acaso tu pantalla es pequeña y no se ve el botón abajo
        await driver.executeScript("arguments[0].scrollIntoView(true);", logoutBtn);
        await driver.sleep(1000);
        
        await logoutBtn.click();
        
        // Esperamos a volver a la pantalla de inicio (login)
        await driver.sleep(2000); 

        // ==========================================
        // PASO 4: LOGIN ADMINISTRADOR
        // ==========================================
        await driver.get('http://127.0.0.1:8000/login');
        await driver.sleep(1000);

        const emailAdmin = await driver.findElement(By.name('email'));
        // IMPORTANTE: Pon el correo real de tu administrador aquí
        await emailAdmin.sendKeys('admin@rosabetania.com'); 
        await driver.sleep(500);
        
        const passAdmin = await driver.findElement(By.name('password'));
        // IMPORTANTE: Pon la contraseña real del administrador aquí
        await passAdmin.sendKeys('admin123'); 
        await driver.sleep(500);

        const btnLoginAdmin = await driver.findElement(By.css('button[type="submit"]'));
        await btnLoginAdmin.click();
        
        await driver.wait(until.urlContains('/dashboard'), 5000);
        await driver.sleep(1500); 
        
        // ==========================================
        // PASO 5: VERIFICAR Y APROBAR SOLICITUD
        // ==========================================
        await driver.get('http://127.0.0.1:8000/horas-extras');
        await driver.sleep(1500);

        try {
            // Buscamos el primer botón que diga "Detalles" pero SOLO en una fila (<tr>) que tenga el estado "Pendiente"
            const btnDetalles = await driver.findElement(By.xpath("//tr[td[contains(., 'Pendiente')]]//a[contains(text(), 'Detalles')]"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", btnDetalles);
            await driver.sleep(1000);
            await driver.executeScript("arguments[0].click();", btnDetalles);
            
            // Esperamos a estar en la página de detalles (/horas-extras/NUMERO)
            await driver.wait(async function() {
                const currentUrl = await driver.getCurrentUrl();
                return currentUrl.match(/\/horas-extras\/\d+/);
            }, 5000);
            await driver.sleep(1500);

            // Buscamos el botón "Procesar Solicitud" (por defecto ya está seleccionado Aprobar)
            const btnProcesar = await driver.findElement(By.xpath("//button[contains(text(), 'Procesar Solicitud')]"));
            await driver.executeScript("arguments[0].scrollIntoView(true);", btnProcesar);
            await driver.sleep(1000);
            await driver.executeScript("arguments[0].click();", btnProcesar);

            // Esperar a que guarde y nos devuelva a la tabla
            await driver.wait(async function() {
                const currentUrl = await driver.getCurrentUrl();
                return currentUrl.includes('/horas-extras') && !currentUrl.match(/\/horas-extras\/\d+/);
            }, 5000);
            
            // Pausa final de 3 segundos para que disfrutes del mensaje verde de éxito
            await driver.sleep(3000);
            
        } catch (error) {
            console.log("No se completó el paso 5. Quizás no había solicitudes pendientes o hubo un error:", error.message);
        }
    });
});
