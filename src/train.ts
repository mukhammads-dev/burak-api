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
TASK Y

Shunday function yozing, uni 2'ta array parametri bo'lsin.
Bu function ikkala arrayda ham ishtirok etgan bir xil
qiymatlarni yagona arrayga joylab qaytarsin.

   MASALAN: findIntersection([1, 2, 3], [3, 2, 0]) return [2, 3]

Yuqoridagi misolda, argument sifatida berilayotgan array'larda
o'xshash sonlar mavjud. Function'ning vazifasi esa ana shu
ikkala array'da ishtirok etgan o'xshash sonlarni yagona arrayga
joylab return qilmoqda.
*/

function findIntersection(arr1: number[], arr2: number[]) {
   let result = [];
   for (const num of arr1) {
      if (arr2.includes(num)) {
         result.push(num)
      }

   }
   return result


}

console.log(findIntersection([1, 2, 3], [3, 2, 0]))











































/* TASK X

Shunday function yozing, uni object va string parametrlari bo'lsin.
Bu function, birinchi object parametri tarkibida, kalit sifatida ikkinchi string parametri
necha marotaba takrorlanganlini sanab qaytarsin.

   Eslatma => Nested object'lar ham sanalsin

MASALAN: countOccurrences({ model: 'Bugatti', steer: { model: 'HANKOOK', size: 30 } }, 'model') return 2

Yuqoridagi misolda, birinchi argument object, ikkinchi argument 'model'.
   Funktsiya, shu ikkinchi argument 'model', birinchi argument object
tarkibida kalit sifatida 2 marotaba takrorlanganligi uchun 2 soni return qilmoqda

function countOccurrences(
   obj: Record<string, any>,
   key: string
): number {
   let count = 0;

   for (const k in obj) {
      if (k === key) {
         count++;
      }

      if (typeof obj[k] === "object" && obj[k] !== null) {
         count += countOccurrences(obj[k], key);
      }
   }

   return count;
}

const result = countOccurrences(
   {
      model: "Bugatti",
      steer: {
         model: "HANKOOK",
         size: 30,
      },
   },
   "model"
);

console.log(result);
  */


/*TASK W

Shunday function yozing, u o'ziga parametr sifatida
yagona array va number qabul qilsin. Siz tuzgan function
arrayni numberda berilgan uzunlikda kesib bo'laklarga
ajratgan holatida qaytarsin.
MASALAN: chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3);
return [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]];

Yuqoridagi namunada berilayotgan array ikkinchi parametr 3'ga
asoslanib 3 bo'lakga bo'linib qaytmoqda. Qolgani esa o'z holati qolyapti

function chunkArray(arr: number[], size: number) {
   let result = [];

   for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
   }

   return result;
}

console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3)) */

/*TASK V

Shunday function yozing, uni string parametri bo'lsin.
Va bu function stringdagi har bir harfni o'zi bilan
necha marotaba taktorlanganligini ko'rsatuvchi object qaytarsin.
  
MASALAN: countChars("hello") return {h: 1, e: 1, l: 2, o: 1}

Yuqoridagi misolda, 'hello' so'zi tarkibida
qatnashgan harflar necha marotaba takrorlangini bilan
object sifatida qaytarilmoqda.

function countChars(prop: string) {
   let result: any = {};
   for (const a of prop) {
      if (result[a]) {
         result[a]++;
      } else {
         result[a] = 1
      }
   }
   return result

}

console.log(countChars("success"))

*/

/*TASK U
Shunday function tuzing, uni number parametri bo'lsin.
Va bu function berilgan parametrgacha, 0'dan boshlab
oraliqda nechta toq sonlar borligini aniqlab return qilsi.

MASALAN: sumOdds(9) return 4; sumOdds(11) return 5;

Yuqoridagi birinchi misolda, argument sifatida, 9 berilmoqda.
Va 0'dan boshlab sanaganda 9'gacha 4'ta toq son mavjud. 
Keyingi namunada ham xuddi shunday xolat takrorlanmoqda.

function sumOdds(prop: number) {
   let count = 0
   for (let i = 0; i < prop; i++) {

      if (i % 2 !== 0) {
         count++;
      }
   }
   return count

}
console.log(sumOdds(11))
*/

/*TASK T
Shunday function tuzing, u sonlardan tashkil topgan 2'ta array qabul qilsin.
Va ikkala arraydagi sonlarni tartiblab bir arrayda qaytarsin.

   MASALAN: mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]); return [0, 3, 4, 4, 6, 30, 31];

Yuqoridagi misolda, ikkala arrayni birlashtirib, tartib raqam bo'yicha tartiblab qaytarmoqda.

function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
   let result = arr1.concat(arr2); // ikkita arr qoshish

   result.sort((a, b) => a - b);
   return result
}

console.log(
   mergeSortedArrays([0, 3, 4, 31], [4, 6, 30])
);

*/

/*S-TASK
Shunday function yozing, u numberlardan tashkil topgan list qabul qilsin 
va osha numberlar orasidagi tushib qolgan sonni topib uni return qilsin
MASALAN: missing_number([3, 0, 1]) return 2

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
*/

/* R-TASK
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

/**TASK Q:
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