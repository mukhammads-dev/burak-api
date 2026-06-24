console.log("Signup frontend javascript file");

// document read it => Image preloading mantigi 
$(function () {
    const fileTarget = $(".file-box .upload-hidden "); // shu class dan qabul qilinadi filetarget
    let filename;
    // filemizda qandaydur change hosil bolganda function ishga tushadi
    fileTarget.on("change", function () {
        // agar file mavjud bolsa 
        if (window.FileReader) {
            const uploadFile = $(this)[0].files[0]; // input ichidag file qolga olamiz
            console.log(uploadFile);
            const fileType = uploadFile["type"];// type checking
            const validImageType = ["image/jpg", "image/jpeg", "image/png"]; // ruxsat beradigon typelarimiz
            if (!validImageType.includes(fileType)) {
                alert("Please insert only jpeg, jpg and png!")
            } else {
                if (uploadFile) {
                    console.log(URL.createObjectURL(uploadFile)); // blob format yaratish
                    $(".upload-img-frame")
                        .attr("src", URL.createObjectURL(uploadFile)) // default image ozgartiramz
                        .addClass("success"); // tekshirish uchun
                }
                filename = $(this)[0].files[0].name;
            }

            $(this).siblings(".upload-name").val(filename); // image name qoyish uchun
        }
    });
});

//FR validation
function validateSignupForm() {
    // .class + .val = form qiymat olish
    const memberNick = $(".member-nick").val();
    const memberPhone = $(".member-phone").val();
    const memberPassword = $(".member-password").val();
    const confirmPassword = $(".confirm-password").val();

    if (
        memberNick === "" ||
        memberPhone === "" ||
        memberPassword === "" ||
        confirmPassword === ""
    ) {
        alert("Please insert all required inputs");
        return false;
    }

    if (memberPassword !== confirmPassword) {
        alert("Password differs, please check!");
        return false;
    }

    const memberImage = $(".member-image").get(0).files[0]
        ? $(".member-image").get(0).files[0].name
        : null;
    if (!memberImage) {
        alert("Please insert restaurant image!");
        return false
    }

}

