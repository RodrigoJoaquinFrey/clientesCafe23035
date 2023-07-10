const { createApp } = Vue
createApp({
    data() {
        return {
            clientes: [],
            url: 'http://localhost:5000/clientes',
            error: false,
            cargando: true,
            /*atributos para el guardar los valores del formulario */
            id: 0,
            nombre: "",
            telefono: 0,
            dni: 0,
            mail: "",
            direccion: "",
        }
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.clientes = data;
                    this.cargando = false
                })
                .catch(err => {
                    console.error(err);
                    this.error = true
                })
        },
        eliminar(cliente) {
            let confirmacion = confirm("ATENCION! Una vez eliminado el cliente no podra recuperarse, esta seguro de eliminarlo?")
            if (confirmacion == true) {
                const url = this.url + '/' + cliente;
                var options = {
                    method: 'DELETE',
                }
                fetch(url, options)
                    .then(res => res.text()) // or res.json()
                    .then(res => {
                        location.reload();
                    })
            } else {
                return false
            };
        },
        grabar() {
            if (this.nombre === '') {
                alert('Debe rellenar el campo "nombre", es obligatorio');
            return; 
            }
            if (this.telefono <= 0) {
                alert('El campo "telefono" debe ser un número válido');
            return;
            }
            if (this.dni <= 0) {
                alert('El campo "DNI" debe ser un número válido');
            return;
            }
            if (this.mail === '') {
                alert('Debe colocar un "mail", es obligatorio');
            return;
            }
            if (this.direccion === '') {
                alert('Debe colocar una "direccion", es obligatorio');
            return;
            }
            let cliente = {
                nombre: this.nombre,
                telefono: this.telefono,
                dni: this.dni,
                mail: this.mail,
                direccion: this.direccion
            }
            var options = {
                body: JSON.stringify(cliente),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            }
            fetch(this.url, options)
                .then(function () {
                    alert("Cliente grabado")
                    window.location.href = "./clientes.html";
                })
                .catch(err => {
                    console.error(err);
                    alert("Error al Grabar")
                })
        }
    },
    created() {
        this.fetchData(this.url)
    },
}).mount('#app')
