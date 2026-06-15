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

/* Cookies:
   request join
   self destroy
*/

/* Validation
   FRONTEND Validation
   BECKEND Validation
   DATABASE Validation
 */

// MIT Tasks ===================
/*
S-TASK

Shunday function yozing, u numberlardan tashkil topgan list qabul qilsin 
va osha numberlar orasidagi tushib qolgan sonni topib uni return qilsin
MASALAN: missing_number([3, 0, 1]) return 2
*/

function missing_number(prop: number[]): number {
   prop.sort((a, b) => a - b);

   let k = 0;

   for (const num of prop) {
      if (num !== k) return k;
      k++;
   }

   return k;
}

console.log(missing_number([3, 0, 1]));

/**
 * R-TASK
Shunday function yozing, u string parametrga ega bolsin. String "1+2" holatda pass 
qilinganda string ichidagi sonlar yigindisini number holatda qaytarsin.
MASALAN: calculate("1+3") return 4;


function calculate(prop: string) {
   let result = 0
   const x = prop.split("+")
   for (const item of x) {
      Number(item)
      result += Number(item)
   }
   return result

}
console.log(calculate("1+3"))
*/

/**
 TASK Q:
Shunday function yozing, u 2 ta parametrga ega bo'lib
birinchisi object, ikkinchisi string bo'lsin.
Agar qabul qilinayotgan ikkinchi string, objectning
biror bir propertysiga mos kelsa, 'true', aks holda mos kelmasa 'false' qaytarsin.

MASALAN: hasProperty({ name: "BMW", model: "M3" }, "model"); return true;
Ushbu misolda, 'model' string, objectning propertysiga mos kelganligi uchun 'true' natijani qaytarmoqda


function hasProperty(obj: object, prop: string) {
   for (const key in obj) {
      if (key === prop) {
         return true;
      }
   }
   return false
}
console.log(hasProperty({ name: "BMW", model: "M3" }, "model"));
 */