-- como voy a discriminar por atributo "shop" y muchas entidades
-- (la mayoria de las "fast food") tenian dicho atributo vacio, lo relleno con "others"
UPDATE comercios_por_zonacensal_geometrias
SET shop = 'other'
WHERE shop =''
RETURNING *;

-- Plan es simbologia según field "shop" y luego sacar los overlays para los fields: amenity, brand, cuisine, name y shop