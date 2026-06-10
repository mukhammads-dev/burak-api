/* Project Standards:

- Logging standards
- Naming standards:
      function, method, variable = CAMEL
      class => PASCAL
      folder = KEBAB
      css => SNAKE
- Error handling 
*/

/*
   Traditinal Api
   Rest Api
   GraphQL Api
*/


/*
   Traditinal FD => BSSR (admin) => EJS
   Modern FD => SPA (user's app) => React
*/

/**
 TASK Q:
Shunday function yozing, u 2 ta parametrga ega bo'lib
birinchisi object, ikkinchisi string bo'lsin.
Agar qabul qilinayotgan ikkinchi string, objectning
biror bir propertysiga mos kelsa, 'true', aks holda mos kelmasa 'false' qaytarsin.

MASALAN: hasProperty({ name: "BMW", model: "M3" }, "model"); return true;
Ushbu misolda, 'model' string, objectning propertysiga mos kelganligi uchun 'true' natijani qaytarmoqda
 */

function hasProperty(obj: object, prop: string) {
   for (const key in obj) {
      if (key === prop) {
         return true;
      }
   }
   return false
}
console.log(hasProperty({ name: "BMW", model: "M3" }, "model"));