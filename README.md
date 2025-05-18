# FullstackParteTres
Este repositorio se modifico rapido con los ejercicios de la parte
3.1 hasta la 3.6 
ya que anteriormente habia generado un repositorio el cual cometi errores y
luego lo bloque por usar comandos de git que no conoci y vi en foros 
por ello cree este y modifique rapido por eso algunas incosistencias 
se espera que en los ejercicios 3.7 hasta el final de el curso no presentar tales incosistencias 

# Ejercicio3.8:
esta parte me costo mucho no sabia como estructurar esta parte: 
"app.use(morgan(":method :url :status :res[content-length] - :response-time ms :request-body"));"
el stringfy y los tokens si los supe realizar por lo leido en el curso pero para el app use
tuve que ver documentacion y apoyarme en algo de ia

# Ejercicio3.9:
Esta parte la entendi facil sabiendo que tenia que simplemente crear un modulo para el front
luego crear otro modulo para el back donde solo copie los documentos de la parte 2 en la misma carpeta
no se si esta debia ser la forma de crear los modulos en los ejercicios anteriores pero asi logre que el back se conecte con el front

# Ejercicio 3.10: 
esta parte fue sencilla leyendo la documentacion del curso de render fue sencillo con el commit creado para probar en esta parte 
el  link creado por render fue https://fullstackpartetres.onrender.com para la parte principal con el commit "2a4ed94
Parte3 ejercicio 3.8"
para acceder a la lista de personas usaremos "https://fullstackpartetres.onrender.com/api/persons"Cabe aclarar que faltan unas personas que 
agregue en los siguientes commits,ademas use esta parte de los ejercicios osea el commit en especifico por que en los siguientes commits tengo el 
front en este modulo pero luego pensare como enviar los commits y ignorar el frond en render

# Ejercicio 3.14:
no se si algun desarrollador o colaborar de este proyecto este revisando el desarrollo del proyecto desconozco esto pero me pregunto si los commits como los realizo son correctos ya que modifique 
el archivo en la parte dos para que funcionara con este pero no puedo realizar commits para ese repo despues de la entrega entonces se analizara lo de aca o deberia mover la parte dos del proyecto 
o simplemente enviar in push con todas las carpetas algo para mi mas pesado y complicado o simplemente agregar el backend y el front en la misma carpeta 

# Ejercicio 3.15:
Este ejercicio me hizo cometer un error fatal con mi repositorio espero sea valido se que en a parte uno se explica que lo mas importante es el envio final pero me gusta tener en orden mis cosas y enviava parte por parte pero en este caso tras querer mover y enviar el backend de un solo envio hice un forced push ya que me pedia un pull pero no me fije en ese pull ya que no queria traer cambios de remoto a local sin embargo el forced push creo que borro todos mis commits anteriores y por ello perdi los commits anteriores esta parte del curso me ha enseñado a los golpes el manejo y el envio

# Ejercicio 3.21:
Ejercicio sencillo con la conexion dek back el front y todo moviendolo a un solo puerto ya que antes el front trabajaba en el puerto "5173" mientras que el back en el "3001" el cual era el optimo 
fue sencillo unir ambos pasando el build al back y archivos necesarios y moviendo el "app.use(express.static("dist"))" para que funcionara, me costo mas fue el render lo cual siempre me da problemas ya que muchas veces no se que son los errores y tengo que buscar documentacion o algun video de youtube pero nada que no se pueda arreglar con varios intentos y dedicacion

# Ejercicio 3.22:
Ultimo ejercicio de la parte 3 Ejercicio que me complico ya que la documentacion no me ofrecio los modulos indicados en la version de lint es decir en export module no se debia usar por que no se soportaba ese formato ya que fue actualizado  .eslintignore ya no es soportado por esta version se utiliza eslint.config.mjs en vez de .eslintrc.js por ello en tanto intento busqueda de documentacion y ayuda de la IA pude hacerlo funcionar y me asuste al ver que mi codigo tenia 4376 errores y me di cuenta que faltaba el ignore dist logre completar esta parte fue la que mas me costo por que erorres minimos generaban gigan