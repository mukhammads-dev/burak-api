console.log("Users frontend javascript file");
//  document read it => tayyor bo'lganda ishga tushadi (jQuery)
$(function () {
    $(".member-status").on("change", function (e) {
        // STEP 1: "member-status" class li ISTALGAN select o'zgarganda ishga tushadi
        // masalan: admin "ACTIVE" dan "BLOCK" ga o'zgartirdi

        const id = e.target.id,
            // STEP 2: o'zgargan select ning ID sini oladi
            // e.target → o'zgargan select element
            // e.target.id → "64abc123efg456" (shu userning MongoDB _id si!)
            // EJS da id="<%= value._id %>" deb yozgandik — mana shu yerda ishlatiladi

            memberStatus = $(`#${id}.member-status`).val();
        // STEP 3: shu select ning yangi qiymatini oladi
        // masalan: "BLOCK"
        // $(`#64abc123efg456.member-status`).val() → "BLOCK"

        axios
            .post("/admin/user/edit", {
                _id: id,  // "64abc123efg456"
                memberStatus: memberStatus,  // "BLOCK"
            })
            // STEP 4: serverga POST yuboradi
            // body = { _id: "64abc123efg456", memberStatus: "BLOCK" }
            // PAGE YANGILANMAYDI — axios orqali background da ketadi (AJAX)

            .then((response) => {
                // STEP 5: server javob berdi
                console.log("response:", response);
                const result = response.data;
                // result = { data: { _id: "...", memberStatus: "BLOCK", ... } }


                if (result.data) {
                    $(".member-status").blur();
                    // STEP 6A: muvaffaqiyatli → select dan focus olib tashla
                    // blur() → vizual jihatdan "saqlandi" effekti
                } else alert("User update failed!");
                // STEP 6B: data kelmasa → xato
            })
            .catch((err) => {
                console.log(err);
                alert("User update failed!");
                // STEP 7: server xato bersa → alert
            });
    });
});