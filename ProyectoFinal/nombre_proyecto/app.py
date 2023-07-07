from flask import Flask,jsonify,request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

app=Flask(__name__) #Crea el objeto app de la clase Flask
CORS(app) #permite acceder desde el front al back

# configuro la base de datos, con el nombre el usuario y la clave
# app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://user:password@localhost/proyecto'
app.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:@127.0.0.1/nombre_proyecto'
# URI de la BBDD                          driver de la BD  user:clave@URLBBDD/nombreBBDD
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']=False #none
db= SQLAlchemy(app)   #crea el objeto db de la clase SQLAlquemy
ma=Marshmallow(app)   #crea el objeto ma de de la clase Marshmallow

# ---------fin configuracion-----------

#definimos la tabla
class Cliente(db.Model):
    id=db.Column(db.Integer, primary_key=True)
    nombre=db.Column(db.String(100))
    telefono=db.Column(db.Integer)
    dni=db.Column(db.Integer)
    mail=db.Column(db.String(20))
    direccion=db.Column(db.String(30))
    def __init__(self,nombre,telefono,dni,mail,direccion):
        self.nombre = nombre
        self.telefono = telefono
        self.dni = dni
        self.mail = mail
        self.direccion = direccion

    #Si hay mas tablas para crear las definimos aca

with app.app_context():
    db.create_all() #Crea las tablas

class ClienteSchema(ma.Schema):
    class Meta:
        fields=('id','nombre','telefono','dni','mail','direccion')
    
cliente_schema=ClienteSchema() #El objeto para traer un producto
clientes_schema=ClienteSchema(many=True) #Trae muchos registro de producto



#Creamos los endpoint
#GET
#POST
#Delete
#Put

#las validaciones las hacemos en estos metodos

#Get endpoint del get
@app.route('/clientes',methods=['GET'])
def get_Clientes():
    all_clientes = Cliente.query.all() #heredamos del db.model
    result= clientes_schema.dump(all_clientes) #lo heredamos de ma.schema
                                                #Trae todos los registros de la tabla y los retornamos en un JSON
    return jsonify(result)


@app.route('/clientes/<id>',methods=['GET'])
def get_cliente(id):
    cliente=Cliente.query.get(id)
    return cliente_schema.jsonify(cliente)   # retorna el JSON de un producto recibido como parametro




@app.route('/clientes/<id>',methods=['DELETE'])
def delete_cliente(id):
    cliente=Cliente.query.get(id)
    db.session.delete(cliente)
    db.session.commit()
    return cliente_schema.jsonify(cliente)   # me devuelve un json con el registro eliminado


@app.route('/clientes', methods=['POST']) # crea ruta o endpoint
def create_cliente():
    #print(request.json)  # request.json contiene el json que envio el cliente
    nombre=request.json['nombre']
    telefono=request.json['telefono']
    dni=request.json['dni']
    mail=request.json['mail']
    direccion=request.json['direccion']
    new_cliente=Cliente(nombre,telefono,dni,mail,direccion)
    db.session.add(new_cliente)
    db.session.commit()
    return cliente_schema.jsonify(new_cliente)


@app.route('/clientes/<id>' ,methods=['PUT'])
def update_cliente(id):
    cliente=Cliente.query.get(id)
 
    cliente.nombre=request.json['nombre']
    cliente.telefono=request.json['telefono']
    cliente.dni=request.json['dni']
    cliente.mail=request.json['mail']
    cliente.direccion=request.json['direccion']

    db.session.commit()
    return cliente_schema.jsonify(cliente)

#Programa Principal
if __name__ == '__main__':
    app.run(debug=True, port=5000)

