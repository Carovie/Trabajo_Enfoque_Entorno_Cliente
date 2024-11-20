/* Inicializa listaCitas si no existe previamente en localStorage. Obtenemos el valor almacenado en localStorage bajo la clave "listaCitas", lo convertimos de JSON a un arrray de JavaScript usando JSON.parse(), y si no se encuentra ningún valor en el almacenamiento (o el valor no es válido), asignamos un array vacío ([]) a listaCitas*/
let listaCitas = JSON.parse(localStorage.getItem("listaCitas")) || [];
let citaAModificar = JSON.parse(localStorage.getItem("citaAModificar")) || [];


class Cita {
    constructor(id_cita, fecha_hora, nombre, apellidos, dni, telefono, fecha_nacimiento, observaciones) {

        this.id_cita = id_cita;
        this.fecha_hora = fecha_hora;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.telefono = telefono;
        this.fecha_nacimiento = fecha_nacimiento;
        this.observaciones = observaciones;
    }
}

/*Valida que la fecha y hora introducidas por el usuario en el formulario, corresponden a un momento igual o posterior al actual, comprobando hasta el minuto actual
*/
function validar_FechaYHora() {

    const fecha_hora_input = document.getElementById("fecha_hora");  //Seleccionamos el campo input del formulario donde se introduce la Fecha y Hora de la cita
    const ahora = new Date();   //Almacenamos en una constante el momento actual (fecha y hora)

    // Dar Formato YYYY-MM-DDTHH:mm para datetime-local
    const año = ahora.getFullYear();
    const mes = String(ahora.getMonth() + 1).padStart(2, '0');  /*La función getMonth() devuelve los meses del 0 al 11, por eso le sumamos 1. La función padStart rellena una cadena con caracteres adicionales al inicio hasta alcanzar una longitud especificada. En este caso queremos que sea cual sea el mes, se represente con dos digitos, por lo que si el mes tiene un unico digito, se va a rellenar con un 0 al inicio. Si el mes ya tiene dos digitos, no añade nada*/
    const dia = String(ahora.getDate()).padStart(2, '0');
    const horas = String(ahora.getHours()).padStart(2, '0');
    const minutos = String(ahora.getMinutes()).padStart(2, '0');

    // Asigna el atributo min con la fecha y hora actual, al campo input del formulario donde se introduce la Fecha y Hora de la cita
    fecha_hora_input.setAttribute("min", `${año}-${mes}-${dia}T${horas}:${minutos}`);
    //fecha_hora_input.min = `${año}-${mes}-${dia}T${horas}:${minutos}`; Esta es otra manera de asignar un atributo a un elemento html, con el .
}


/*Esta función se encarga de validar el formulario antes de ejecutar la función que crea la cita. 
@param event. objeto de evento que contiene información sobre la acción que se está realizando (en este caso, el envío del formulario). 
*/
function validarYCrearCita(event) {

    /*Validación de HTML5 (se activa automáticamente por el navegador). checkValidity() es una función integrada en HTML5 que verifica si el formulario cumple con las reglas de validación que se han definido en los campos del formulario (por ejemplo, en los atributos required, pattern, minlength, etc.). Si el formulario no es válido, se evita el envío del formulario con la instrucción event.preventDefault(), se muestra un mensaje de alerta y se detiene la ejecución de la función.*/
    if (!document.getElementById("formulario").checkValidity()) {
        // Si el formulario no es válido, no continuamos
        event.preventDefault();
        alert("Por favor, complete todos los campos correctamente.");
        return;
    }

    // Si la validación HTML5 pasa, es correcta (todos los campos son validos), entonces se llamamos a la función crearCita(event) para procesar los datos del formulario
    crearCita(event);
}


/*Función que se encarga de crear una nueva cita o modificar una ya existente
@param event. objeto de evento que contiene información sobre la acción que se está realizando
*/
function crearCita(event) {

    event.preventDefault(); //Evita el envío automático del formulario.  Se llama al inicio para evitar que el formulario se envíe de manera predeterminada. Esto es necesario porque estamos manejando el envío del formulario con JavaScript.

    let citaAModificar = JSON.parse(localStorage.getItem("citaAModificar"));  /*Recuperamos si hubiera alguna cita a modificar almacenada en el localStorage, para saber si esta ejecución se correspondiera con que el usuario ha seleccionado modificar una cita ya existente o crear una nueva*/

    if (citaAModificar && citaAModificar.nombre) {  /*Si hubiera una cita a modificar válida almacenada en el localStorage, esto implica que el usuario ha seleccionado la opción de modificar una cita existente y no la de crear una cita nueva, por lo que aplicaríamos el procedimiento de "modificar" la cita, que implica eliminación de la cita antigua + la creación de la cita nueva, en lugar de directa y unicamente la creación, que sería lo que hacemos en el caso de que el usuario seleccione la opción de crear una nueva cita. Este ultimo caso iría por el else{}*/

        let index = -1;

        for (let i = 0; i < listaCitas.length; i++) {

            if (listaCitas[i].id_cita === citaAModificar.id_cita) {    /*Buscamos la posición en la que se encuentra almacenada en el array de Citas, la cita que quiere modificar el usuario. Para ello recorremos el array de citas y buscamos aquella cita cuyo id de cita (es un campo unico en cada cita, formado por la fecha y hora de la cita + el DNI del paciente) coincida con el id de cita de la cita almacenada en citaAModificar, que es la cita que quiere modificar el usuario*/
                index = i;
                break;
            }
        }

        listaCitas.splice(index, 1);        /*Eliminamos del array de Citas, la cita la cual el usuario quiere modificar alguno de sus valores (la cita "antigua") para que no nos queden dos citas distintas ya que ahora vamos a crear una nueva cita utilizando como base los valores de la cita antigua pero con alguno/s de sus valor/es modificados por el usuario*/

        localStorage.removeItem("citaAModificar");  //Eliminamos del localStorage la cita a modificar que estaba almacenada para que no nos de problemas de cara al futuro

        //Creamos la "nueva" cita que viene a ser una modificación de la antigua que acabamos de eliminar
        let id_cita = document.getElementById("fecha_hora").value + "_" + document.getElementById("dni").value;
        let fecha_hora = document.getElementById("fecha_hora").value;
        let nombre = document.getElementById("nombre").value;
        let apellidos = document.getElementById("apellidos").value;
        let dni = document.getElementById("dni").value;
        let telefono = document.getElementById("telefono").value;
        let fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
        let observaciones = document.getElementById("observaciones").value;

        let cita = new Cita(id_cita, fecha_hora, nombre, apellidos, dni, telefono, fecha_nacimiento, observaciones);

        listaCitas.push(cita);

        //Almacenamos en el localStorage el array de Citas con la cita antigua eliminada y la nueva creada
        localStorage.setItem("listaCitas", JSON.stringify(listaCitas));

        alert("Formulario válido. Cita modificada");

    } else { //Si en lugar de la opción de la modificación de una cita es la creación de una cita nueva

        let id_cita = document.getElementById("fecha_hora").value + "_" + document.getElementById("dni").value;
        let fecha_hora = document.getElementById("fecha_hora").value;
        let nombre = document.getElementById("nombre").value;
        let apellidos = document.getElementById("apellidos").value;
        let dni = document.getElementById("dni").value;
        let telefono = document.getElementById("telefono").value;
        let fecha_nacimiento = document.getElementById("fecha_nacimiento").value;
        let observaciones = document.getElementById("observaciones").value;

        let cita = new Cita(id_cita, fecha_hora, nombre, apellidos, dni, telefono, fecha_nacimiento, observaciones);

        listaCitas.push(cita);

        //Almacenamos en el localStorage el array de Citas con la cita nueva creada
        localStorage.setItem("listaCitas", JSON.stringify(listaCitas));

        alert("Formulario válido. Cita creada");
    }

    //Después de crear la nueva cita, limpiamos los campos del formulario
    document.getElementById("fecha_hora").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("apellidos").value = "";
    document.getElementById("dni").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("fecha_nacimiento").value = "";
    document.getElementById("observaciones").value = "";

    window.location.href = "listado_citas.html";
}

/*Función que se encarga de insertar en la tabla del HTML el listado de citas con sus valores o un mensaje indicando que no hay citas
*/
function mostrarCitas() {

    localStorage.removeItem("citaAModificar"); /*En el caso de que el usuario seleccione la opción de modificar una cita desde el botón correspondiente en el listado de citas y una vez que se le cargue el formulario con los valores de la cita a modificar, si el usuario finalmente decide no modificar la cita y simplemente se va a la pantalla del listado de citas, la llamada a este metodo hace que se elimine del localStorage el valor almacenado bajo la clave citaAModificar, que lo que provocaba en estas circunstancias era que al volver al formulario, siguieran mostrandose en sus campos, los valores de la cita que el usuario anteriormente habia decidido modificar pero que finalmente no lo hizo al moverse a la pantalla del listado de citas*/

    /*Inicializa listaCitas si no existe previamente en localStorage. Obtenemos el valor almacenado en localStorage bajo la clave "listaCitas", lo convertimos de JSON a un arrray de JavaScript usando JSON.parse(), y si no se encuentra ningún valor en el almacenamiento (o el valor no es válido), asignamos un array vacío ([]) a listaCitas*/
    let listaCitas = JSON.parse(localStorage.getItem("listaCitas")) || [];
    let pos = 1; //Esta va a ser la posición que se muestra en la fila de cada tabla indicando en que posición de la tabla se encuentra cada cita. Este valor nos servirá tambien como indice de cada cita en el array de Citas

    const tbody = document.getElementById("tabla").getElementsByTagName('tbody')[0];
    /*Buscamos en el documento HTML el elemento con el id "tabla", que es la tabla de las citas. Una vez que tenemos el elemento de la tabla de citas, usamos el método getElementsByTagName('tbody') para obtener todos los elementos <tbody> dentro de esa tabla. Este método devuelve una colección de todos los elementos <tbody> que estén dentro de la tabla, aunque en este caso solo hay uno. Debido a que getElementsByTagName devuelve una  colección (incluso si solo hay un <tbody>), usamos [0] para acceder al primer (y en este caso único) elemento <tbody>. Asi seleccionamos el elemento <tbody> dentro de la tabla con id="tabla" y lo asignamos a la constante tbody. Después de esta línea, tbody hace referencia directa al <tbody> dentro de la tabla con id="tabla". Esto nos permitirá modificar el contenido del <tbody> usando JavaScript.*/

    if (listaCitas.length == 0) {  //Si no hay ninguna cita almacenada en el array de citas

        tbody.innerHTML = `
            <tr>
                <td colspan="8">Dato vacío</td>
            </tr>
        `;
    } else { //Si hay una o más citas en el array de citas

        /*Recorremos el array listaCitas y por cada cita creamos una fila en el body de la tabla, con ocho columnas que contiene cada una el atributo correspondiente de la cita más una con un contador que indica la posición de la cita en la tabla. Cuando se pulsan los botones modificarCita y eliminarCita, llamamos a su función asociada correspondiente pasándoles como parámetro el indice en el que se encuentra cada cita seleccionada (a modificar o eliminar), en el array de citas (que sería su posición en la tabla -1)*/
        listaCitas.forEach(function (cita) {

            tbody.innerHTML += `
                <tr>
                    <td>${cita.fecha_hora}</td>
                    <td>${cita.nombre}</td>
                    <td>${cita.apellidos}</td>
                    <td>${cita.dni}</td>
                    <td>${cita.telefono}</td>
                    <td>${cita.fecha_nacimiento}</td>
                    <td>${cita.observaciones}</td>
                    <td>${pos}</td>
                    <td id="celda_botones"><button class="botones_formulario" onclick="modificarCita(${pos - 1})">Modificar</button>
                    <button class="botones_formulario" onclick="eliminarCita(${pos - 1})">Eliminar</button></td>
                </tr>
            `;
            pos++;
        });
    }
}


/*Elimina la cita del array de citas del indice pasado como parámetro, esto es, la cita correspondiente al botón eliminar de la tabla de citas en el que el usuario "clickeó". Almacena el array resultante de citas en el localStorage y recarga la pagina listado_citas.html
@param pos. La posición en la que se encuentra la cita a eliminar en el array de citas
*/
function eliminarCita(pos) {

    alert(`La cita del paciente ${listaCitas[pos].nombre} ${listaCitas[pos].apellidos} ha sido eliminada`);
    listaCitas.splice(pos, 1);
    localStorage.setItem("listaCitas", JSON.stringify(listaCitas));
    location.reload();
}


/*Almacena en el array citaAModificar, la cita del array de citas del indice pasado como parametro, esto es, la cita correspondiente al botón modificar de la tabla de citas en el que el usuario "clickeó". Almacena el array citaAModificar en el localStorage y redirecciona a la pagina del formulario de nueva cita
@param pos. La posición en la que se encuentra la cita a modificar en el array de citas
*/
function modificarCita(pos) {

    citaAModificar = listaCitas[pos];
    localStorage.setItem("citaAModificar", JSON.stringify(citaAModificar));
    window.location.href = "nueva_cita.html";
}


/*Función que se encarga de cargar en los campos del formulario, los valores de la cita que el usuario desea modificar
*/
function cargarCita() {

    let citaAModificar = JSON.parse(localStorage.getItem("citaAModificar"));  /*Recuperamos si hubiera alguna cita a modificar almacenada en el localStorage, para saber si esta ejecución se correspondiera con que el usuario ha seleccionado modificar una cita ya existente o crear una nueva*/

    if (citaAModificar && citaAModificar.nombre) {   /*Si hubiera una cita a modificar válida almacenada en el localStorage, esto implica que el usuario ha seleccionado la opción de modificar una cita existente y no la de crear una cita nueva, por lo que cargaríamos en los campos del formulario de crear nueva cita, los atributos de la cita que el usuario seleccionó para modificar. Si la ejecución correspondiera a que el usuario seleccionó la opción de crear nueva cita (en caso de que no haya una cita a modificar válida almacenada en el localStorage), no se haría nada*/

        document.getElementById("fecha_hora").value = citaAModificar.fecha_hora;
        document.getElementById("nombre").value = citaAModificar.nombre;
        document.getElementById("apellidos").value = citaAModificar.apellidos;
        document.getElementById("dni").value = citaAModificar.dni;
        document.getElementById("telefono").value = citaAModificar.telefono;
        document.getElementById("fecha_nacimiento").value = citaAModificar.fecha_nacimiento;
        document.getElementById("observaciones").value = citaAModificar.observaciones;
    }
}





