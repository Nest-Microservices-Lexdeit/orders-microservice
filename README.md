# ORDERS MICROSERVICE


Forma de conexion a la base de datos
```
docker compose up -d
```


Generar el Prisma client - Solo si se presenta el error de prisma
```
bunx prisma generate
```

Levantar servidor de NATS
```
docker run -d --name nats-main -p 4222:4222 -p 6222:6222 -p 8222:8222 nats
```