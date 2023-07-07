console.log(location.search)     // lee los argumentos pasados a este formulario
var id=location.search.substr(4)
console.log(id)
const { createApp } = Vue
  createApp({
    data() {
      return {
        id:0,
        nombre:"",
        telefono:0,
        dni:0,
        mail:"",
        direccion:"",
        url:'http://localhost:5000/clientes/'+id,
       }  
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.id=data.id
                    this.nombre = data.nombre;
                    this.telefono=data.telefono
                    this.dni=data.dni
                    this.mail=data.mail
                    this.direccion=data.direccion                    
                })
                .catch(err => {
                    console.error(err);
                    this.error=true              
                })
        },
        modificar() {
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
                nombre:this.nombre,
                telefono: this.telefono,
                dni: this.dni,
                mail:this.mail,
                direccion:this.direccion
            }
            var options = {
                body: JSON.stringify(cliente),
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
            }
            fetch(this.url, options)
                .then(function () {
                    alert("Cliente actualizado con exito")
                    window.location.href = "./clientes.html";             
                })
                .catch(err => {
                    console.error(err);
                    alert("Hubo un error al actualizar el cliente")
                })      
        }
    },
    created() {
        this.fetchData(this.url)
    },
  }).mount('#app')
