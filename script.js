/* =========================================
   ELEMENTS
========================================= */

const pullButton =
    document.getElementById("pullButton");

const pullString =
    document.getElementById("pullString");

const loginSection =
    document.getElementById("loginSection");

const loginForm =
    document.getElementById("loginForm");

const signInButton =
    document.getElementById("signInButton");

const usernameInput =
    document.getElementById("username");

const passwordInput =
    document.getElementById("password");

const message =
    document.getElementById("message");

const lampGlow =
    document.querySelector(".lamp-glow");

const ambientLight =
    document.querySelector(".ambient-light");

const body =
    document.body;


/* =========================================
   LAMP SETTINGS
========================================= */

let isOn = false;

let isDragging = false;

let startY = 0;

let currentPull = 0;


/*
    ระยะลากสูงสุด
*/

const maxPull = 80;


/*
    ต้องลากถึงระยะนี้
    เพื่อเปิด/ปิดไฟ
*/

const activationDistance = 55;


/*
    ความสูงสายเดิม
*/

const originalStringHeight = 120;


/* =========================================
   STARTING STATE
========================================= */

loginSection.style.opacity = "0";

loginSection.style.visibility = "hidden";

loginSection.style.pointerEvents = "none";


/* =========================================
   POINTER DOWN
========================================= */

pullButton.addEventListener(
    "pointerdown",
    (event) => {

        isDragging = true;

        startY = event.clientY;

        currentPull = 0;


        /*
         * ให้ปุ่มติดตาม Pointer
         */

        pullButton.setPointerCapture(
            event.pointerId
        );


        pullButton.style.cursor =
            "grabbing";

    }
);


/* =========================================
   POINTER MOVE
========================================= */

pullButton.addEventListener(
    "pointermove",
    (event) => {

        if (!isDragging) {
            return;
        }


        /*
         * คำนวณระยะที่ลาก
         */

        let distance =
            event.clientY - startY;


        /*
         * ห้ามลากขึ้น
         */

        if (distance < 0) {
            distance = 0;
        }


        /*
         * จำกัดระยะสูงสุด
         */

        distance =
            Math.min(
                distance,
                maxPull
            );


        currentPull = distance;


        /*
         * =================================
         * ขยับลูกตุ้ม
         * =================================
         */

        gsap.set(
            pullButton,
            {
                y: distance
            }
        );


        /*
         * =================================
         * ยืดสายตามลูกตุ้ม
         * =================================
         */

        gsap.set(
            pullString,
            {
                height:
                    originalStringHeight
                    + distance
            }
        );


        /*
         * =================================
         * แสงเล็กน้อยระหว่างลาก
         * =================================
         */

        if (!isOn) {

            gsap.set(
                lampGlow,
                {
                    opacity:
                        distance / 300
                }
            );

        }


        /*
         * =================================
         * ถึงระยะที่กำหนด
         * =================================
         */

        if (
            distance >=
            activationDistance
        ) {

            if (isOn) {

                /*
                 * ถ้าไฟเปิดอยู่
                 * ให้ปิด
                 */

                turnLampOff();

            } else {

                /*
                 * ถ้าไฟดับอยู่
                 * ให้เปิด
                 */

                turnLampOn();

            }

        }

    }
);


/* =========================================
   POINTER UP
========================================= */

pullButton.addEventListener(
    "pointerup",
    (event) => {

        isDragging = false;

        pullButton.style.cursor =
            "grab";


        /*
         * ถ้าปล่อยก่อนถึงระยะ
         * ให้ลูกตุ้มเด้งกลับ
         */

        if (
            currentPull <
            activationDistance
        ) {

            resetPull();

        }


        /*
         * ป้องกัน Pointer ค้าง
         */

        try {

            pullButton.releasePointerCapture(
                event.pointerId
            );

        } catch (error) {

            // ไม่ต้องทำอะไร

        }

    }
);


/* =========================================
   POINTER CANCEL
========================================= */

pullButton.addEventListener(
    "pointercancel",
    () => {

        isDragging = false;

        resetPull();

    }
);


/* =========================================
   RESET PULL
========================================= */

function resetPull() {

    currentPull = 0;


    /*
     * ลูกตุ้มเด้งกลับ
     */

    gsap.to(
        pullButton,
        {
            y: 0,

            duration: 0.5,

            ease:
                "elastic.out(1, 0.35)"
        }
    );


    /*
     * สายกลับตำแหน่งเดิม
     */

    gsap.to(
        pullString,
        {
            height:
                originalStringHeight,

            duration: 0.4,

            ease:
                "power2.out"
        }
    );


    /*
     * ถ้าไฟยังดับ
     * ลดแสงกลับเป็น 0
     */

    if (!isOn) {

        gsap.to(
            lampGlow,
            {
                opacity: 0,

                duration: 0.25
            }
        );

    }

}


/* =========================================
   TURN LAMP ON
========================================= */

function turnLampOn() {

    /*
     * ป้องกันการเรียกซ้ำ
     */

    if (isOn) {
        return;
    }


    isOn = true;

    isDragging = false;


    /*
     * =================================
     * ลูกตุ้มเด้งกลับ
     * =================================
     */

    gsap.to(
        pullButton,
        {
            y: 0,

            duration: 0.5,

            ease:
                "elastic.out(1, 0.35)"
        }
    );


    /*
     * =================================
     * สายเด้งกลับ
     * =================================
     */

    gsap.to(
        pullString,
        {
            height:
                originalStringHeight,

            duration: 0.45,

            ease:
                "power2.out"
        }
    );


    /*
     * =================================
     * เปิดแสงโคม
     * =================================
     */

    gsap.to(
        lampGlow,
        {
            opacity: 1,

            scale: 1.2,

            duration: 0.8,

            ease:
                "power2.out"
        }
    );


    /*
     * =================================
     * เปิดแสงทั่วหน้า
     * =================================
     */

    gsap.to(
        ambientLight,
        {
            opacity: 1,

            scale: 1.2,

            duration: 1.2,

            ease:
                "power2.out"
        }
    );


    /*
     * =================================
     * เปลี่ยน Background
     * =================================
     */

    gsap.to(
        body,
        {
            backgroundColor:
                "#1c1f24",

            duration: 1
        }
    );


    /*
     * เพิ่มสถานะ lamp-on
     */

    body.classList.add(
        "lamp-on"
    );


    /*
     * =================================
     * แสดง Login
     * =================================
     */

    loginSection.style.visibility =
        "visible";

    loginSection.style.pointerEvents =
        "auto";


    gsap.to(
        loginSection,
        {
            opacity: 1,

            x: 0,

            scale: 1,

            duration: 1,

            delay: 0.35,

            ease:
                "power3.out"
        }
    );


    /*
     * Animation ของ Login Form
     */

    gsap.from(
        loginForm,
        {
            y: 25,

            duration: 0.8,

            delay: 0.5,

            ease:
                "power3.out"
        }
    );

}


/* =========================================
   TURN LAMP OFF
========================================= */

function turnLampOff() {

    /*
     * ป้องกันการเรียกซ้ำ
     */

    if (!isOn) {
        return;
    }


    isOn = false;

    isDragging = false;


    /*
     * =================================
     * ลูกตุ้มเด้งกลับ
     * =================================
     */

    gsap.to(
        pullButton,
        {
            y: 0,

            duration: 0.5,

            ease:
                "elastic.out(1, 0.35)"
        }
    );


    /*
     * =================================
     * สายเด้งกลับ
     * =================================
     */

    gsap.to(
        pullString,
        {
            height:
                originalStringHeight,

            duration: 0.45,

            ease:
                "power2.out"
        }
    );


    /*
     * =================================
     * ดับแสงโคม
     * =================================
     */

    gsap.to(
        lampGlow,
        {
            opacity: 0,

            scale: 1,

            duration: 0.5,

            ease:
                "power2.out"
        }
    );


    /*
     * =================================
     * ดับแสงทั่วห้อง
     * =================================
     */

    gsap.to(
        ambientLight,
        {
            opacity: 0,

            scale: 1,

            duration: 0.8,

            ease:
                "power2.out"
        }
    );


    /*
     * =================================
     * เปลี่ยน Background กลับ
     * =================================
     */

    gsap.to(
        body,
        {
            backgroundColor:
                "#0b0d0f",

            duration: 0.8
        }
    );


    /*
     * ลบสถานะ lamp-on
     */

    body.classList.remove(
        "lamp-on"
    );


    /*
     * =================================
     * ซ่อน Login
     * =================================
     */

    gsap.to(
        loginSection,
        {
            opacity: 0,

            x: 60,

            scale: 0.96,

            duration: 0.5,

            ease:
                "power2.in",

            onComplete: () => {

                loginSection.style.visibility =
                    "hidden";

                loginSection.style.pointerEvents =
                    "none";

            }
        }
    );


    /*
     * ล้างข้อความ Login
     */

    message.textContent = "";

}


/* =========================================
   SIGN IN
========================================= */

signInButton.addEventListener(
    "click",
    () => {

        const username =
            usernameInput.value.trim();

        const password =
            passwordInput.value.trim();


        /*
         * =================================
         * ตรวจ Username
         * =================================
         */

        if (username === "") {

            message.textContent =
                "Please enter your username.";


            gsap.fromTo(
                usernameInput,

                {
                    x: -8
                },

                {
                    x: 0,

                    duration: 0.4,

                    ease:
                        "elastic.out(1, 0.3)"
                }
            );


            usernameInput.focus();

            return;
        }


        /*
         * =================================
         * ตรวจ Password
         * =================================
         */

        if (password === "") {

            message.textContent =
                "Please enter your password.";


            gsap.fromTo(
                passwordInput,

                {
                    x: -8
                },

                {
                    x: 0,

                    duration: 0.4,

                    ease:
                        "elastic.out(1, 0.3)"
                }
            );


            passwordInput.focus();

            return;
        }


        /*
         * =================================
         * Login สำเร็จ
         * =================================
         */

        message.textContent =
            "Login successful!";


        gsap.to(
            signInButton,
            {
                scale: 0.96,

                duration: 0.1,

                yoyo: true,

                repeat: 1
            }
        );

    }
);