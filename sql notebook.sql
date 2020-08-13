-- como voy a discriminar por atributo "shop" y muchas entidades
-- (la mayoria de las "fast food") tenian dicho atributo vacio, lo relleno con "others"
UPDATE comercios_por_zonacensal_geometrias
SET shop = 'other'
WHERE shop =''
RETURNING *;

-- Plan es simbologia según field "shop" y luego sacar los overlays para los fields: amenity, brand, cuisine, name y shop

-- Hago un back up dela bbdd.
pg_dump -h localhost -U postgres -p 5432 tfm_unigis > tfm_unigis_backup.dump
-- Me he dado cuenta que las zonas censales sin indice, salen null y no se representan en los estilos. Meto que sea un 0 en vez de null en aquellos poligonos que no tienen comercios
CREATE TABLE indicadores_zonascenso_comercios_nonull AS
	SELECT t1_1_indic AS habitantes, geom, objectid_zonas, COALESCE(nodes_count, 0) AS num_comercios, COALESCE(tfm_indice,0) AS ratio FROM indicadores_zonascenso_comercios;