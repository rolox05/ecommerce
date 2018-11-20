<a name="top"></a>
# Audit Service v0.1.0

Microservicio de Auditoría

- [Auditoria](#auditoria)
	- [Audit Artículo](#audit-artículo)
	- [Audit Image](#audit-image)
	- [Audit Order](#audit-order)
	- [Audit User](#audit-user)
	
- [RabbitMQ](#rabbitmq)
	- [Usuario Deslogueado](#usuario-deslogueado)
	- [Usuario Creado](#usuario-creado)
	- [Usuario Editado](#usuario-editado)
	- [Usuario Logueado](#usuario-logueado)
	- [Artículo Comprado](#artículo-comprado)
	- [Artículo Creado](#artículo-creado)
	- [Artículo Borrado](#artículo-borrado)
	- [Artículo Editado](#artículo-editado)
	- [Imagen Creada](#imagen-creada)
	- [Pago agregado a Orden](#pago-agregado-a-orden)
	- [Orden Creada](#orden-creada)
	


# <a name='auditoria'></a> Auditoria

## <a name='audit-artículo'></a> Audit Artículo
[Back to top](#top)

<p>Permite Auditar las acciones realizadas sobre el artículo articleId</p>

	GET /v1/audit/article/{articleId}




### Success Response

Body

```
HTTP/1.1 200 Ok
     [
        {
           "userId": "String",
           "userName": "string",
           "action": "string",
           "articleName": "string",
           "articleId": "string",
           "date": "Date",
           "_id": "string",
           "articleData": {
               "id": "string",
               "name": "string",
               "description": "string",
               "price": number,
               "stock": number,
               "enabled": boolean,
               "quantity": number,
               "orderId": string
           },
           "__v": 0
       }
       ...
   ]
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
{
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='audit-image'></a> Audit Image
[Back to top](#top)

<p>Permite Auditar las acciones realizadas sobre el imagen imageId</p>

	GET /v1/audit/image/{imageId}




### Success Response

Body

```
HTTP/1.1 200 Ok
     [
       {
           "_id": "{id de acción}"
    	     "imagenid": "{imagenId}",
          “action”: “{action}”,
          "date": "{timeStamp}"
       },
       ...
   ]
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
{
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='audit-order'></a> Audit Order
[Back to top](#top)

<p>Permite Auditar las acciones realizadas sobre la orden orderId</p>

	GET /v1/audit/order/{orderId}




### Success Response

Body

```
   HTTP/1.1 200 Ok
        [
          {
              "_id": "{id de acción}"
              "fecha": "{timestamp}",
              "cartId": "{string}",
              "userId": "{string}",
              "articles": [
              		articleId: String,
                 quantity: number
	              ],
            	 "method": String
           	 "amount": number,
          },
          ...
      ]
```


### Error Response

400 Bad Request

```
HTTP/1.1 400 Bad Request
{
   "messages" : [
     {
       "path" : "{Nombre de la propiedad}",
       "message" : "{Motivo del error}"
     },
     ...
  ]
}
```
500 Server Error

```
HTTP/1.1 500 Internal Server Error
{
   "error" : "Not Found"
}
```
## <a name='audit-user'></a> Audit User
[Back to top](#top)

<p>Permite Auditar las acciones realizadas por el usuario userId</p>

	GET /v1/audit/user/{userId}




### Success Response

Mensaje

```
  {
      "userId": "{userId}",
      "date": "{timeStamp}",
      "userData": {
          name: string,
          login: string,
          permissions: string[],
          updated: Date,
          created: Date,
          enabled: Boolean
          editor: editor,
          target: target,
          changes: changes, (roles added/removed)
          action: action (grant, revoke, enable, disable)
        },
		 "user": string,
 	 "action": string
 }
```


# <a name='rabbitmq'></a> RabbitMQ

## <a name='usuario-deslogueado'></a> Usuario Deslogueado
[Back to top](#top)

<p>Consume de mensajes logout desde Auth con el topic &quot;logout&quot;.</p>

	FANOUT auth/logout




### Success Response

Mensaje

```
    {
    "type": "user-login/logout",
    "message" : {
        "userId": "{userId}",
        "date": "{timeStamp}",
        “message”: {
	    	 "user": string,
 		 "action": string
       }
      }
    }
```


## <a name='usuario-creado'></a> Usuario Creado
[Back to top](#top)

<p>Consume de mensajes user-created desde Auth con el topic &quot;user-created&quot;.</p>

	TOPIC auth/user-created




### Success Response

Mensaje

```
{
"type": "user-created",
"message" : {
    "userId": "{userId}",
    "date": "{timeStamp}",
    "userData": {
        name: string,
        login: string,
        permissions: string[],
        updated: Date,
        created: Date,
        enabled: Boolean
       }
   }
}
```


## <a name='usuario-editado'></a> Usuario Editado
[Back to top](#top)

<p>Consume de mensajes user-edit desde Auth con el topic &quot;user-edit&quot;.</p>

	TOPIC auth/user-edit




### Success Response

Mensaje

```
{
"type": "user-edit",
"message" : {
    "userId": "{userId}",
    "date": "{timeStamp}",
    "userData": {
          "editor": editor,
          "target": target,
          "changes": changes, (roles added/removed)
          "action": action (grant, revoke, enable, disable)
      }
   }
}
```


## <a name='usuario-logueado'></a> Usuario Logueado
[Back to top](#top)

<p>Consume de mensajes user-login desde Auth con el topic &quot;user-login&quot;.</p>

	TOPIC auth/user-login




### Success Response

Mensaje

```
{
"type": "user-login/logout",
"message" : {
    "userId": "{userId}",
    "date": "{timeStamp}",
    “action”: “{string}”
   }
}
```


## <a name='artículo-comprado'></a> Artículo Comprado
[Back to top](#top)

<p>Consume de mensajes article-bought desde Catalog con el topic &quot;article-bought&quot;.</p>

	TOPIC catalog/article-bought




### Success Response

Mensaje

```
    {
    "type": "article-bought",
    "message" : {
        "articleId": "{articleId}",
        "date": "{timeStamp}",
        "articleData": {
	          "id": String,
           "price": Float,
           "stock": Integer,
           "enabled": Boolean,
     	  "orderId": "{orderId}",
           "quantity": "{int}"
         }
       }
    }
```


## <a name='artículo-creado'></a> Artículo Creado
[Back to top](#top)

<p>Consume de mensajes article-created desde Catalog con el topic &quot;article-created&quot;.</p>

	TOPIC catalog/article-created




### Success Response

Mensaje

```
{
"type": "article-created",
"message" : {
    "userId": string,
    "userName": string,
    "articleId": "{articleId}",
    “articleName”: “{articleName}”,
    "date": "{timeStamp}",
    "articleData": {
           "name": String,
           "description": String,
           "price": Float,
           "stock": Integer,
           "enabled": Boolean
     }
   }
}
```


## <a name='artículo-borrado'></a> Artículo Borrado
[Back to top](#top)

<p>Consume de mensajes article-deleted desde Catalog con el topic &quot;article-deleted&quot;.</p>

	TOPIC catalog/article-deleted




### Success Response

Mensaje

```
{
"type": "article-deleted",
"message" : {
    "userId": string,
    "userName": string,
    "articleId": "{articleId}",
    “articleName”: “{articleName}”,
    "date": "{timeStamp}",
    "articleData": {
           "name": String,
           "description": String,
           "price": Float,
           "stock": Integer,
           "enabled": Boolean
     }
   }
```


## <a name='artículo-editado'></a> Artículo Editado
[Back to top](#top)

<p>Consume de mensajes article-edited desde Catalog con el topic &quot;article-edited&quot;.</p>

	TOPIC catalog/article-edited




### Success Response

Mensaje

```
{
"type": "article-edited",
"message" : {
    "userId": string, (agregado)
    "userName": string, (agregado)
    "articleId": "{articleId}",
    “articleName”: “{articleName}”,
    "date": "{timeStamp}",
    "articleData": {
           "name": String,
           "description": String,
           "image": String, (deprecado, no está en el servicio catalog)
           "price": Float,
           "stock": Integer,
           "updated": datetime, (deprecado, no está en el servicio catalog)
           "created": datetime, (deprecado, no está en el servicio catalog)
           "enabled": Boolean
     }
   }
}
```


## <a name='imagen-creada'></a> Imagen Creada
[Back to top](#top)

<p>Consume de mensajes image-created desde Imagen con el topic &quot;image-created&quot;.</p>

	TOPIC imagen/image-created




### Success Response

Mensaje

```
{
"type": "image-created",
"message" : {
    "imagenid": "{imagenId}",
    “action”: “{action}”,
    "date": "{timeStamp}"
   }
}
```


## <a name='pago-agregado-a-orden'></a> Pago agregado a Orden
[Back to top](#top)

<p>Consume mensajes order-payment desde Order con el topic &quot;order_payment&quot;.</p>

	TOPIC order/order-payment




### Success Response

Mensaje

```
{
"type": "order-payment",
"message" : {
    "userId": "{userId}",
    "orderId": "{orderId}",
    "method": "{paymentMethod}",
    "amount": "{amount}",
   }
}
```


## <a name='orden-creada'></a> Orden Creada
[Back to top](#top)

<p>Consume de mensajes order-placed desde Orden con el topic &quot;order-placed&quot;.</p>

	TOPIC order/order-placed




### Success Response

Mensaje

```
{
"type": "order-placed",
"message" : {
    "orderId": "{orderId}",
    “cartId”: “{cartId}”,
    "date": "{timeStamp}",
    "articles": [{
       articleId: String
       quantity: Number,
     }]
   }
}
```


