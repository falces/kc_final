# WALLAKEEP
Wallakeep es una aplicación para la publicación de anuncios de compraventa entre particulares. Este documento da todas las instrucciones necesarias para su descarga, despliegue, inicialización y puesta en producción.

## DESPLIEGUE
La aplicación se encuentra desplegada en un servidor web configurado dentro de un servicio EC2 de Amazon AWS. Se ha usado Nginx como proxy inverso para poder acceder desde la URL:

[http://kc.ozonea.com/]()

## VARIABLES DE ENTORNO
A partir del archivo de ejemplo:

```
.env.example
```
Crear un archivo

```
.env
```
Con las variables correctas. Como norma general sólo deberemos corregir la cadena de conexión con la base de datos y el puerto desde el que se va a servir la aplicación. Este archivo no se registrará en el control de versiones.

## DESCARGA
Para descargar esta aplicación es necesario clonar el repositorio original:

`git clone https://github.com/falces/kc_final.git`

## INICIALIZACIÓN DE LA BASE DE DATOS
Una vez iniciado el servidor de base de datos Mongo, será necesario inicializar la base de datos con algunos datos de ejemplo. Para ello, nos situamos dentro de la carpeta en la que hemos descargado la aplicación y ejecutamos:

`node ./lib/installDB`

## INICIAR LA APLICACIÓN
Ahora podemos iniciar la aplicación. Desde la misma carpeta raíz, ejecutamos:

`npm start`

Y tendremos la aplicación servida en el servidor local y en el puerto configurado en el archivo .env.

Junto con la aplicación se inicializarán los diferentes microservicios necesarios.

Podemos acceder a la aplicación en `http://localhost:3000` (si hemos elegido el puerto 3000).


## API SIN AUTENTICACIÓN

### LISTA DE TAGS
Request:

```
https://localhost:3000/apiv1/tags
```
Response:

```
{
    "success": true,
    "tags": [
        "lifestyle",
        "motor",
        "mobile",
        "home",
        "garden",
        "computer",
        "tv",
        "games"
    ]
}
```

### JWT LOGIN

Request:

```
https://localhost:3000/apiv1/login
```
Parámetros GET/POST:

```
{
    email: falces@gmail.com,
    password: 1234
}
```
Response:

```
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGQ4MTAzZjBlYzgyNTA2NGY0MDVlYTgiLCJpYXQiOjE1NzQ0NDE4MDYsImV4cCI6MTU3NDYxNDYwNn0._GRZyLPOMV15ksrZv_oVehNwX7hd_bTQm7hwx6U_Q-g"
}
```

## API CON AUTENTICACIÓN

### LISTA DE ANUNCIOS
Se requiere token de autenticación.

Request:

```
https://localhost:3000/apiv1/anuncios?tag=mobile,motor&nombre=&start=0&limit=100&sort=_id&venta=false&precio=-50
```
Autenticación POST/GET:
```
token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGQ4MTAzZjBlYzgyNTA2NGY0MDVlYTgiLCJpYXQiOjE1NzQ0NDE4MDYsImV4cCI6MTU3NDYxNDYwNn0._GRZyLPOMV15ksrZv_oVehNwX7hd_bTQm7hwx6U_Q-g
```

Response:

```
{
	"success": true,
    "anuncios": [
        {
            "tags": [
                "lifestyle",
                "mobile"
            ],
            "_id": "5dd8103f0ec825064f405e9d",
            "nombre": "iPhone 3GS",
            "venta": false,
            "precio": 50,
            "foto": "iphone.jpg",
            "__v": 0
        },
        {
            "tags": [
                "lifestyle"
            ],
            "_id": "5dd8103f0ec825064f405ea2",
            "nombre": "Bicicleta Montaña",
            "venta": false,
            "precio": 90,
            "foto": "bici2.jpg",
            "__v": 0
        }
    ]
}

```
### NUEVO ANUNCIO
Se require token de autenticación

Request POST:

```
https://localhost:3000/apiv1/nuevo
```

Parámetros:

```
{
    nombre: "Bicicleta estática",
    "tags": ["lifestyle", "home"],
    precio: 100,
    venta: true,
    imagen: [ARCHIVO DE IMAGEN]
}
```