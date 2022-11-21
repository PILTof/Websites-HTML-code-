$(document).ready(function () {

    const idClinics = document.getElementById('clinics');
    const selectorCliniscs = document.getElementsByClassName('clinic-selector');
    const selectorProfessions = document.getElementById('profession-selector');
    const selectorProfessionItem = document.getElementsByClassName('profession-item');
    const selectorDoctors = document.getElementById('doctors-selector');
    const selectorDoctorItem = document.getElementsByClassName('doctor-item');
    const selectorSchedule = document.getElementById('selector-schedule');

    let arErrors = [];

    let url = 'https://form.lazaretspb.ru:3010/api/public/';
    let api_key = "773f09e8217cd1675dd25d743d388e73";

    let curStep = 0;
    let defaultStepsLabels = {0: 'Клиника', 1: 'Врач / Услуга', 2: 'Дата и время', 3: 'Данные пациента'}
    // clinic_name, doctor_name, date_interval, pacient
    let stepsPosition = {0: '', 1: '', 2: '', 3: ''};

    let stepsDataPacient = {
        'first_name': '',
        'last_name': '',
        'third_name': '',
        'birth_date': '',
        'mobile': '',
        'email': '',
        'doctor_id': '',
        'time_start': '',
        'time_end': '',
        'clinic_id': '',
    }
    let currentClinicID = 0;
    let currentDoctorID = 0;
    let currentSchedule = "";

    let currentDoctorsList = [];
    let doctorsList = [];
    let clinicsList = [];
    let professionsList = [];

    let monthPicker = $('#month-picker')[0];
    let calendarCurrentMonth = new Date().getMonth();
    let calendarCurrentDay = "";
    let calendarInsertDate = "";
    let calendarAttempts = 0;
    let prevDay = 0;

    let daysClasses = {
        'cur_work': 'v-btn--text v-date-picker-table__current v-btn--active accent',
        'cur_nowork': 'v-btn--flat v-date-picker-table__current v-btn--outlined accent--text v-btn--disabled',
        'work': 'v-btn--text',
        'nowork': 'v-btn--text v-btn--flat v-btn--disabled',
        'sel_work': 'accent v-btn--active',
        'btn': 'v-btn v-btn--rounded theme--light',
        'selected': 'v-btn--active accent',
    }

    let schedulePostfields = {
        "method": "getSchedule",
        "doctor_id": currentDoctorID,
        "clinic_id": currentClinicID,
    };

    let user_consent = false;

    let formValids = {
        'last_name': false,
        'first_name': false,
        'third_name': false,
        'birth_date': false,
        'mobile': false,
        'email': false,
    };

    let smsCode = 0;
    let appointmenID = 0;
    let isSmsSended = false;
    let isFormValid = false;
    let isUserDataValid = false;
    let isSmsValid = false;

    getAjaxData({"method": "getClinics"}).then(
        clinics_data => {
            setClinicsToDOM(clinics_data);
            clinics_data.forEach(function (item, i, arr) {
                clinicsList[item["id"]] = item;
            });
        },
        error => arErrors.push({"getClinics":error})
    )

    getAjaxData({"method": "getProfessions"}).then(
        professions_data => {
            professions_data.forEach(function (item, i, arr) {
                professionsList[item["id"]] = item;
            });
        },
        error => arErrors.push({"getProfessions":error})
    )

    function sendAjaxSMS(mobile){

        smsCode = Math.floor(1000 + Math.random() * 9000);
        smsCode = Number(smsCode);

        let btn = $("button[data-role=sms-resend]")[0];
        if (btn !== undefined){
            lockBtnByTimer(btn);
        }

        return new Promise(function(resolve, reject) {
            $.ajax({
                type: "POST",
                url: 'sendsms.php',
                data: {
                    "code": smsCode,
                    "mobile": mobile
                },
                dataType: "json",
                success: function(smsResponse) {

                    // smsResponse = JSON.parse(smsResponse);
                    if (smsResponse["error"] === 0) {
                        if (typeof smsResponse === 'object') {

                            if (smsResponse["data"] === "created") {
                                resolve(true);
                            } else {
                                resolve(false);
                            }
                        } else {
                            resolve(false);
                        }
                    }
                    else {
                        reject(smsResponse["error"]);
                    }
                },
                error: function(err) {
                    reject(err)
                }
            });
        });
    }

    function getAjaxData(postfields){
        return new Promise(function(resolve, reject) {
            postfields["api_key"] = api_key;

            $.ajax({
                type: "POST",
                url: url,
                data: postfields,
                dataType: "json",
                beforeSend: function() {
                },
                success: function(data) {

                    let jsonData = data["data"];

                    if (data["error"] === 0) {
                        if (typeof jsonData === 'object' || jsonData.trim().length > 0) {
                            if (Object.keys(jsonData).length > 0) {
                                resolve(jsonData);
                            } else {
                                resolve({});
                            }
                        } else {
                            resolve({});
                        }
                    }
                    else {
                        reject(data);
                    }
                },
                error: function(err) {
                    reject(err) // Reject the promise and go to catch()
                }
            });
        });
    }

    $("#input37").on('input', function (event){
        document.getElementById("input41").value = "";
        findProf(this.value);
        setDoctorsToDOM(doctorsList);
    });

    $("#input37").on('click', function (event){
        document.getElementById("input41").value = "";
        if (document.getElementById("input37").value === ""){
            setDoctorsToDOM(doctorsList);
        }
    });

    function findProf(str){
        let newList = [];
        let word = str.toLowerCase();

        professionsList.forEach(function (item, i, arr) {
            let name = item["name"].toLowerCase();
            let flag = name.indexOf(word, 0);
            if (flag >= 0){
                newList[i] = (item);
            }
        });
        if (str === ""){
            setProfessionsToDOM(professionsList);
        }else{
            setProfessionsToDOM(newList);
        }
    }

    $("#input41").on('input', function (event){
        findDoc(this.value);
    });

    function findDoc(str){
        let newList = {};
        let word = str.toLowerCase();
        Object.keys(doctorsList).forEach(key =>{
            let name = doctorsList[key]["name"].toLowerCase();
            let flag = name.indexOf(word, 0);
            if (flag >= 0){
                newList[key] = doctorsList[key];
            }
        })
        if (str === ""){
            setDoctorsToDOM(doctorsList);
        }else{
            setDoctorsToDOM(newList);
        }
    }

    $("body").on("click", "button[data-role=changemobile]", function (){
        document.getElementById("userdata").style.display = "block";
        document.getElementById("usermobverify").style.display = "none";
        isSmsSended = false;
    });

    $("body").on("click", "button[data-role=sms-resend]", function (){
        sendAjaxSMS(smsCode, document.getElementById("mobile").value).then(
            sendsmsresult => {
                isSmsSended = sendsmsresult;
            },
            error => arErrors.push({"sendAjaxSMS":error})
        )
    });

    $("body").on("click", "button[data-role=repeatapp]", function (){
        location.reload();
    });
    $("body").on("click", "button[data-role=reload]", function (){
        location.reload();
    });

    // $("body").on("click", "button.adapt41, button.adapt37", function (){
    //     if (this.classList.contains('adapt41')){
    //         $('div.adapt41')[0].classList.remove('hidden-xs-only');
    //         $('div.adapt37')[0].classList.add('hidden-xs-only');
    //     }
    //     if (this.classList.contains('adapt37')){
    //         $('div.adapt37')[0].classList.remove('hidden-xs-only');
    //         $('div.adapt41')[0].classList.add('hidden-xs-only');
    //     }
    // });

    $("body").on("click", ".v-stepper__step--editable", function (){
        curStep = this.querySelector('.v-stepper__step__step').innerText;
        stepChanger(null, 2);
    });

    $("body").on("click", "button[data-role=createappoint]", function (){

        isFormValid = formValidation();
        isUserDataValid = userDataValidation();

        if(isFormValid && isUserDataValid && isSmsSended === false){

            document.getElementById("userdata").style.display = "none";
            document.getElementById("usermobverify").style.display = "block";

            let message = $("#usermobverify .v-alert__content");
            if (Object(message).length === 1){
                message[0].innerText = "Код подтверждения отправлен на: " + document.getElementById("mobile").value;
            }

            if (isSmsSended === false){
                sendAjaxSMS(document.getElementById("mobile").value).then(
                    sendsmsresult => {
                        isSmsSended = sendsmsresult;
                    },
                    error => arErrors.push({"sendAjaxSMS":error})
                )
            }
        }
        else if(isFormValid && isUserDataValid && isSmsSended)
        {
            const main = document.getElementById("main");
            const finalStep = document.getElementById("step-final");
            isSmsValid = Number(document.getElementById("input-sms").value) === smsCode;

            if (isSmsValid){
                stepsDataPacient["method"] = "createAppointment";
                getAjaxData(stepsDataPacient).then(
                    result => {
                        appointmenID = result;
                    },
                    error => arErrors.push({"createAppointment":error})
                )
                main.style.display = "none";
                finalStep.style.display = "block";
                let msgStatus = finalStep.getElementsByClassName("headline mb-5")[0].innerText;
                let msgTable = finalStep.querySelectorAll("td");
                msgTable[0].innerText = "Обычная запись";
                msgTable[1].innerText = clinicsList[stepsDataPacient["clinic_id"]]["title"];
                msgTable[2].innerText = doctorsList[stepsDataPacient["doctor_id"]]["name"];
                msgTable[3].innerText = stepsPosition[2];

                redirectTimer();
            }
        }
    });
    $('#user_consent').on('click', function (event) {
        user_consent = this.checked;
    })

    $("#userdata").on('input', 'input', function (event) {
        let formInput = this;

        let formLegend = formInput.parentNode.parentNode.parentNode.querySelector('legend');
        let formLegendSpan = formInput.parentNode.parentNode.parentNode.querySelector('span');
        let formWarning = formInput.parentNode.parentNode.parentNode.getElementsByClassName('v-messages__wrapper')[0];

        if (formInput.value !== ''){
            formLegend.style.width = 'auto';
            formLegendSpan.style.padding = '0 10px';
            formLegendSpan.innerText = formInput.placeholder;
        }else{
            formLegendSpan.innerText = "";
            formLegendSpan.style.padding = '0';
            formLegend.style.width = "0px";
        }

        formWarning.innerText = '';

        switch (formInput.id){
            case 'last_name':
            case 'first_name':
            case 'third_name':
                let resText = validateText(formInput.value, formInput.id);
                if( resText !== true ) {
                    formWarning.innerText = resText;
                    stepsDataPacient[formInput.id] = "";
                } else {
                    stepsDataPacient[formInput.id] = formInput.value;
                }
                break;
            case 'birth_date':
                let resBirth = validateDate(formInput.value, formInput.id);
                if( resBirth !== true ) {
                    formWarning.innerText = resBirth;
                    stepsDataPacient[formInput.id] = "";

                } else {
                    stepsDataPacient[formInput.id] = formInput.value;
                }
                break;
            case 'mobile':
                let resMobile = validatePhone(formInput.value, formInput.id);

                if( resMobile !== true ) {
                    formWarning.innerText = resMobile;
                    stepsDataPacient[formInput.id] = "";

                } else {
                    stepsDataPacient[formInput.id] = formInput.value;
                }

                break;
            case 'email':
                let resEmail = validateEmail(formInput.value, formInput.id);

                if( resEmail !== true ) {
                    formWarning.innerText = resEmail;
                    stepsDataPacient[formInput.id] = "";
                } else {
                    stepsDataPacient[formInput.id] = formInput.value;
                }
        }

    });

    function redirectTimer(){

        let mesg = $("#step-final .caption span")[0];

        let prevInner = mesg.innerText.trim();

        var timeleft = 10;
        var downloadTimer = setInterval(function(){
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                window.location.href = '/';

                return;
            }
            mesg.innerText = prevInner + " " +  timeleft + " секунд(-ы)";
            timeleft -= 1;
        }, 1000);
    }

    $('button[data-role=nav]').click(function() {

        if (stepsPosition[curStep] && this.dataset.direction === "right"){
            stepChanger(true)
        }else if (this.dataset.direction === "left"){
            stepChanger(false)
        }
    });

    $('button[data-role=calendar-left]').click(function(){
        if (monthPicker !== null){
            let month = Number(monthPicker.dataset.month);
            let year = Number(monthPicker.dataset.year);

            if (month !== undefined && year !== undefined){
                doctorCalendar("calendar", year, month - 1);
            }
        }
    });

    $('button[data-role=calendar-right]').click(function(){

        if (monthPicker !== null){
            let month = Number(monthPicker.dataset.month);
            let year = Number(monthPicker.dataset.year);

            if (month !== undefined && year !== undefined){
                doctorCalendar("calendar", year, month + 1);
            }
        }
    });

    $('button[data-role=all-clinic-selector]').click(function() {

        let professions = [];
        currentClinicID = 0;

        stepsPosition[0] = defaultStepsLabels[0];
        stepChanger(true);

        let postfields = {
            "method": "getUsers",
            "role": "doctor",
        };
        schedulePostfields["clinic_id"] = 0;

        getAjaxData(postfields).then(
            json_data => {

                doctorsList = restructureDoctorsList(json_data);
                setDoctorsToDOM(json_data);

                professions = makeProfessionsFromDoctors(json_data);
                setProfessionsToDOM(professions);
            },
            error => arErrors.push({"getUsers all clinics":error})
        )
    });

    $("body").on("click", "button[data-role=clinic]", function () {

        let clinic_id = this.dataset.id;
        if (clinic_id !== undefined || clinic_id > 0) {
            currentClinicID = clinic_id;
            stepsPosition[0] = clinicsList[clinic_id]['title'];
            stepChanger(true)

            let postfields = {
                "method": "getUsers",
                "clinic_id": clinic_id,
                "role": "doctor",
            };

            schedulePostfields["clinic_id"] = currentClinicID;

            getAjaxData(postfields).then(
                json_data => {
                    doctorsList = restructureDoctorsList(json_data);
                    setDoctorsToDOM(json_data);

                    let professions = makeProfessionsFromDoctors(json_data);
                    setProfessionsToDOM(professions);
                },
                error => arErrors.push({"getUsers clinic id":error})
            )
        }
    });

    $("body").on("click", ".profession-item", function (){
        let profession_id = this.id;
        if (profession_id !== undefined && profession_id > 0) {
            $('#input41')[0].value = "";
            document.getElementsByClassName('caption text-center')[curStep].innerText = professionsList[profession_id]['name'];
            let postfields = {
                "method": "getUsers",
                "role": "doctor",
                "profession_id": profession_id,
            };
            if (Object.keys(doctorsList).length > 0){
                let newObj = {};
                Object.keys(doctorsList).forEach(key =>{

                    if (doctorsList[key]["profession"].includes(profession_id)){
                        newObj[key] = doctorsList[key];
                    }
                })
                setDoctorsToDOM(newObj);
            }
        }
    });

    $("body").on("click", ".doctor-item", function (){
        let doc_id = this.dataset.id;
        intervalClearIntervals();
        intervalClearDocAvatars();

        if (doc_id !== undefined && doc_id > 0) {
            calendarAttempts = 0;
            calendarCurrentMonth = new Date().getMonth();
            toggleStepDateTime("allnone");
            currentDoctorID = doc_id;
            stepsPosition[1] = doctorsList[currentDoctorID]['name'];
            stepsDataPacient['doctor_id'] = currentDoctorID;
            doctorCalendar("calendar", new Date().getFullYear(), calendarCurrentMonth);

            stepChanger(true);
            insertDateToCalendar();
        }
    });

    $("body").on("click", "button[data-role=interval]", function (){

        //step two
        stepsPosition[2] = calendarInsertDate + ', ' + this.innerText;

        let curAppointment = currentSchedule[this.dataset.cindex][this.dataset.index];
        stepsDataPacient['doctor_id'] = curAppointment['user_id'];
        stepsDataPacient['time_start'] = curAppointment['date'] + " " + curAppointment['time_start_short'];
        stepsDataPacient['time_end'] = curAppointment['date'] + " " + curAppointment['time_end_short'];
        stepsDataPacient['clinic_id'] = curAppointment['clinic_id'];
        stepChanger(true);
    });

    // D A Y
    $("#calendar").on("click", "button", function (){
        let day_number =  Number(this.innerText);
        if (!isNaN(day_number)){
            intervalClearIntervals();
            calendarCurrentDay = day_number;
            insertDateToCalendar();
            markSelectedDay(day_number);

            getAjaxData(schedulePostfields).then(
                schedule_data => {

                    let jsonData = restructureSchedule(schedule_data[currentDoctorID]);
                    if (jsonData[calendarCurrentMonth]!== undefined && jsonData[calendarCurrentMonth][day_number] !== undefined){
                        setScheduleIntervalsToDOM(jsonData[calendarCurrentMonth][day_number]);
                    }else{
                        arErrors.push({"getSchedule #calendar": "empty json data in schedule request"});
                    }
                },
                error => arErrors.push({"getSchedule #calendar":error})
            )
        }
    });

    function lockBtnByTimer(btn){
        let prevInner = btn.innerText;
        btn.disabled = true;
        btn.classList.remove("accent--text");

        var timeleft = 10;
        var downloadTimer = setInterval(function(){
            if(timeleft <= 0){
                clearInterval(downloadTimer);
                btn.innerText = prevInner;
                btn.classList.add("accent--text");
                btn.disabled = false;
                return;
            }
            btn.innerText = prevInner + " (" +  timeleft + ")";
            timeleft -= 1;
        }, 1000);
    }

    function validateEmail(str, id){
        const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        formValids[id] = false;

        if(!reg.test(str)) return 'Некорректная почта';

        formValids[id] = true;

        return true;
    }

    function validatePhone(str, id){
        const reg = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

        formValids[id] = false;
        if(!reg.test(str)) return 'Некорректный номер';

        formValids[id] = true;
        return true;
    }

    function validateText(str, id){
        const reg = /[0-9]/;
        formValids[id] = false;

        if (reg.test(str)) return 'Не может содержать цифры'
        if (str.trim().length <= 0) return 'Необходимо заполнить';
        if (str.trim().length === 1) return 'Минимум 2 символа';

        formValids[id] = true;
        return true;
    }

    function validateDate (str, id) {
        formValids[id] = false;

        if (str == "") return 'Не введена дата рождения';
        if (!/^\d\d\.\d\d\.\d{4}$/.test (str)) return 'Не верный формат даты';

        var a0 = function (x) {return ((x < 10) ? '0' : '') + x},
            t = str.split ('.'), ndt = new Date (+t [2], t[1] - 1, +t [0]);

        with (ndt) var tst = [a0 (getDate ()), a0 (getMonth () + 1), getFullYear ()].join ('.');

        let curDate = new Date;
        let isBigger = Number(curDate.getFullYear()) - Number(t[2]);

        if (tst != str || isBigger <= 0) return 'Не существующая дата';
        formValids[id] = true;

        return true;
    }

    function userDataValidation(){

        let isUserDataValid = true;

        Object.keys(stepsDataPacient).forEach(key =>{
            if (key.trim() !== "email" && key.trim() !== "third_name"){
                if (String(stepsDataPacient[key]).trim().length <= 0){
                    isUserDataValid = false;
                }
            }
        })
        return isUserDataValid;
    }

    function formValidation(){

        let isFormValid = true;
        Object.keys(formValids).forEach(key => {

            if (formValids[key] !== true){
                let formInput = document.getElementById(key);

                if (formInput !== undefined){
                    let formWarning = formInput.parentNode.parentNode.parentNode.getElementsByClassName('v-messages__wrapper')[0];

                    switch (key){
                        case 'last_name':
                        case 'first_name':
                            // case 'third_name':
                            let resText = validateText(formInput.value, key);
                            if( resText !== true ) {
                                formWarning.innerText = resText;
                                stepsDataPacient[formInput.id] = "";
                                isFormValid = false;
                            }else {
                                stepsDataPacient[formInput.id] = formInput.value;
                            }

                            break;
                        case 'birth_date':
                            let resBirth = validateDate(formInput.value, key);
                            if( resBirth !== true ) {
                                formWarning.innerText = resBirth;
                                stepsDataPacient[formInput.id] = "";
                                isFormValid = false;
                            }
                            else {
                                stepsDataPacient[formInput.id] = formInput.value;
                            }
                            break;
                        case 'mobile':
                            let resMobile = validatePhone(formInput.value, key);

                            if( resMobile !== true ) {
                                formWarning.innerText = resMobile;
                                stepsDataPacient[formInput.id] = "";
                                isFormValid = false;
                            }
                            else {
                                stepsDataPacient[formInput.id] = formInput.value;
                            }
                            break;
                        // case 'email':
                        //     let resEmail = validateEmail(formInput.value, key);
                        //
                        //     if( resEmail !== true ) {
                        //         formWarning.innerText = resEmail;
                        //         stepsDataPacient[formInput.id] = "";
                        //     }
                    }
                }
            }

        })

        if (!user_consent) isFormValid = false;
        return isFormValid;
    }

    function restructureSchedule(jsonData) {

        const arResult = {};
        if (typeof jsonData === 'object') {
            jsonData.forEach(function (item, i, arr) {

                let clinic_id = String(item['clinic_id']);
                let arDate = item['date'].split(".");
                let month = arDate[1];
                let day = arDate[0];

                if (month[0] === "0") month = month[1];
                if (day[0] === "0") day = day[1];

                if (typeof arResult[month] === "undefined") {
                    arResult[month] = {};
                }
                if (typeof arResult[month][day] === "undefined") {
                    arResult[month][day] = {};
                }
                if (typeof arResult[month][day][clinic_id] === "undefined") {
                    arResult[month][day][clinic_id] = {};
                }
                arResult[month][day][clinic_id][i] = item;
            });

        }
        return arResult;
    }

    function restructureDoctorsList(jsonData){

        let doctors = {};
        if (jsonData !== undefined){

            jsonData.forEach(function (item, i, arr) {
                doctors[item['id']] = item;
            });
        }
        return doctors;
    }

    function makeProfessionsFromDoctors(jsonData) {
        let professions = {};

        if (jsonData !== undefined) {
            jsonData.forEach(function (item, i, arr) {
                item["profession"].forEach(function (prof, i, arr) {
                    if (professionsList[prof] !== undefined){
                        professions[prof] = professionsList[prof];
                    }
                });
            });
        }
        return professions;
    }

    function insertDateToCalendar(){
        let date = new Date(new Date().getFullYear(), calendarCurrentMonth, calendarCurrentDay);
        document.querySelector('.v-picker__title__btn' + '.v-date-picker-title__year').innerHTML = date.getFullYear();
        let insertDate = date.toLocaleString('ru', {weekday: 'short'}) + ', ' + calendarCurrentDay + ' ' + date.toLocaleString('ru', {month: 'short'});
        calendarInsertDate = insertDate;
        document.querySelector('.v-picker__title__btn' + '.v-date-picker-title__date' + '.v-picker__title__btn--active').innerHTML = insertDate;
    }

    function toggleStepDateTime(state){

        if (state === "calendar"){
            document.getElementById("step-datetime-calendar").style.display = "block";
            document.getElementById("step-datetime-message").style.display = "none";
        }else if (state === "message"){
            document.getElementById("step-datetime-calendar").style.display = "none";
            document.getElementById("step-datetime-message").style.display = "block";
        }else if (state === "allnone"){
            document.getElementById("step-datetime-calendar").style.display = "none";
            document.getElementById("step-datetime-message").style.display = "none";
        }
    }

    function clearNodes(parentNode, childNodes) {

        if (childNodes != null && childNodes.length > 0){
            while (parentNode.firstChild) {
                parentNode.removeChild(parentNode.firstChild);
            }

        }else{
            while (parentNode.firstChild) {
                parentNode.removeChild(parentNode.firstChild);
            }
        }
    }

    function intervalClearIntervals(){
        let intervals = $('#selector-schedule button');
        if (intervals.length > 0){
            for (var i = 0; i < intervals.length; i++) {
                intervals[i].remove();
            }
        }
    }

    function intervalClearDocAvatars(){
        let intervals = $('#selector-schedule div');
        if (intervals.length > 0){
            for (var i = 0; i < intervals.length; i++) {
                intervals[i].remove();
            }
        }
    }

    function stepChanger(direction, step=-1){

        if (curStep === 0 && direction === false) return;
        if (curStep === 3 && direction === true) return;

        let stepBlock = $('.v-stepper__content');
        let steps = $('.v-stepper__step');
        let stepsTitles = $('.caption.text-center');
        let stepsNums = $('.v-stepper__step__step');

        let navRight = $('button[data-role=nav][data-direction=right]');
        let lastElement = navRight.length - 1;

        if (direction === true && step === -1){
            curStep++;
        }else{
            curStep--;
        }

        if (curStep >= 3){
            navRight[lastElement].style.display="none";
        }else{
            navRight[lastElement].style.display="block";
        }

        if (curStep < 1){
            $('div.adapt41')[0].classList.add('hidden-xs-only');
            $('div.adapt37')[0].classList.add('hidden-xs-only');
        }

        for (let i=0; i < 4; i++){

            if (stepsPosition[i]) {
                stepsTitles[i].innerText = stepsPosition[i];
            }else{
                stepsTitles[i].innerText = defaultStepsLabels[i];
            }
            if (i === curStep){
                stepBlock[i].style.display = "";
            }else{
                stepBlock[i].style.display = "none";
            }

            if (i === curStep){
                steps[i].classList.add('v-stepper__step--complete');
                steps[i].classList.add('v-stepper__step--active');
                steps[i].classList.add('v-stepper__step--editable');
                stepsNums[i].classList.add('accent');

            }else if (i > curStep){
                steps[i].classList.remove('v-stepper__step--active');
                steps[i].classList.add('v-stepper__step--inactive');
                steps[i].classList.remove('v-stepper__step--editable');
                steps[i].classList.remove('v-stepper__step--complete');
                stepsNums[i].classList.remove('accent');
            }
        }
    }

    function setScheduleDoctorAvatarToDOM(parNode, clinic_id) {

        if (parNode !== undefined){

            let item_root = document.createElement('div');
            item_root.className = 'subtitle-2 font-weight-bold';

            let clinic_name = "";
            if (clinic_id > 0){
                clinic_name = ', (' + clinicsList[clinic_id].title + ')';
            }

            let item_doc_name = document.createElement('span');
            item_doc_name.className = 'schedule-doc-name';
            item_doc_name.innerText = doctorsList[currentDoctorID].name + " " + clinic_name;

            parNode.appendChild(item_root);
            if ( doctorsList[currentDoctorID].avatar_small !== null){

                let item_avatar = document.createElement('div');
                item_avatar.className = 'v-avatar mb-2 mr-2';
                item_avatar.style.height = '48px';
                item_avatar.style.minWidth = '48px';
                item_avatar.style.width = '48px';

                let item_responsive = document.createElement('div');
                item_responsive.className = 'v-responsive v-image';

                let item_responsive_sizer = document.createElement('div');
                item_responsive_sizer.className = 'v-responsive__sizer';
                item_responsive_sizer.style.paddingBottom = '116.474%';

                let item_responsive_image = document.createElement('div');
                item_responsive_image.className = 'v-image__image v-image__image--cover';

                item_responsive_image.style.backgroundImage = "url(" + doctorsList[currentDoctorID].avatar_small + ")";
                item_root.appendChild(item_avatar);
                item_root.appendChild(item_doc_name);

                item_avatar.appendChild(item_responsive);
                item_responsive.appendChild(item_responsive_sizer);
                item_responsive.appendChild(item_responsive_image);

            }else{
                item_root.appendChild(item_doc_name);
            }
        }
    }

    function setScheduleIntervalsToDOM(jsonData) {
        if (jsonData !== undefined) {

            currentSchedule = jsonData;
            clearNodes(selectorSchedule, null);

            Object.keys(jsonData).forEach(key => {
                // clinic

                let item_clinic = document.createElement('div');
                item_clinic.className = 'mb-5';

                let clID = 0;
                if (Object.keys(jsonData).length > 1 || currentClinicID <= 0){
                    clID = key
                }

                selectorSchedule.appendChild(item_clinic);
                setScheduleDoctorAvatarToDOM(item_clinic, clID);

                Object.keys(jsonData[key]).forEach(key2 =>{
                    // intervals

                    let item = document.createElement('button');
                    item.className = 'ma-1 v-btn v-btn--depressed v-btn--flat v-btn--outlined theme--light v-size--large blue-grey--text text--white--text';
                    item.type = 'button';

                    let item_content = document.createElement('span');
                    item_content.className = 'v-btn__content';
                    item.dataset.role = 'interval';
                    item.dataset.cindex = key;
                    item.dataset.index = key2;
                    item_content.innerText = jsonData[key][key2]['time'];
                    item_clinic.appendChild(item);
                    item.appendChild(item_content);
                });
            });
            toggleStepDateTime("calendar");
        }
    }

    function markSelectedDay(day){
        let days = $("#calendar .v-btn");
        days[day-1].className = `${daysClasses.btn} ${daysClasses.selected}`;
        if (prevDay > 0){
            let status = days[prevDay-1].dataset.day;
            days[prevDay-1].className = `${daysClasses.btn} ${daysClasses[status]}`;
        }
        prevDay = day;
    }

    function setClinicsToDOM(jsonData) {
        if (jsonData !== undefined) {
            jsonData.forEach(function (clinic, i, arr) {

                let item = document.createElement('div');
                item.className = 'row justify-center';

                let item_bootstrap = document.createElement('div');
                item_bootstrap.className = 'mb-5 col-sm-8 col-md-6 col-lg-4 col-12';

                let item_bootstrap_button = document.createElement('button');
                item_bootstrap_button.dataset.id = clinic.id;
                item_bootstrap_button.dataset.role = "clinic";
                item_bootstrap_button.type = 'button';
                item_bootstrap_button.className = 'clinic-selector v-btn v-btn--block v-btn--depressed theme--light v-size--x-large accent white--text';

                item_bootstrap_button.innerText = clinic.title;

                var item_title = document.createElement('span');
                item_title.className = 'v-btn__content';
                item_title.innerText = clinic.title;

                idClinics.appendChild(item);
                item.appendChild(item_bootstrap);
                item_bootstrap.appendChild(item_bootstrap_button);

            });

        } else {
            arErrors.push({"setClinicsToDOM":"json data is empty"})
        }
    }

    function setDoctorsToDOM(jsonData) {

        if (jsonData !== undefined) {
            clearNodes(selectorDoctors, selectorDoctorItem);
            Object.keys(jsonData).forEach(key =>  {

                let item = document.createElement('div');
                item.tabIndex = 0;
                item.id = jsonData[key].id;
                item.dataset.id = jsonData[key].id;
                item.className = 'doctor-item v-list-item v-item--active v-list-item--active v-list-item--link theme--light';
                item.title = jsonData[key].name;
                item.role = 'option';
                item.style.minHeight = 'auto';

                let avatar = document.createElement('div');
                avatar.className = 'v-avatar v-list-item__avatar';
                avatar.style.height = '40px';
                avatar.style.minWidth = '40px';
                avatar.style.width = '40px';

                let avatar_responsive = document.createElement('div');
                avatar_responsive.className = 'v-responsive v-image';

                let avatar_responsive_sizer = document.createElement('div');
                avatar_responsive_sizer.className = 'v-responsive__sizer';
                avatar_responsive_sizer.style.paddingBottom = '116.474%';

                let avatar_responsive_image = document.createElement('div');
                avatar_responsive_image.className = 'v-image__image v-image__image--cover';
                avatar_responsive_image.style.backgroundImage = "url(" + jsonData[key].avatar_small + ")";
                avatar_responsive_image.style.backgroundPosition = "center center";

                let avatar_responsive_content = document.createElement('div');
                avatar_responsive_content.className = 'v-responsive__content';
                avatar_responsive_content.style.width = '692px';

                let content = document.createElement('div');
                content.className = 'v-list-item__content';
                // content.dataset.id = jsonData[key].id;


                let content_title = document.createElement('div');
                content_title.className = 'v-list-item__title';
                content_title.innerHTML = jsonData[key].name;

                let content_subtitle = document.createElement('div');
                content_subtitle.className = 'v-list-item__subtitle';
                content_subtitle.innerHTML = jsonData[key].profession_titles;

                let separator = document.createElement('hr');
                separator.role = 'separator';
                separator.className = 'v-divider theme--light';

                selectorDoctors.appendChild(item);
                item.appendChild(avatar);
                avatar.appendChild(avatar_responsive);
                avatar_responsive.appendChild(avatar_responsive_sizer);
                avatar_responsive.appendChild(avatar_responsive_image);
                avatar_responsive.appendChild(avatar_responsive_content);

                item.appendChild(content);
                content.appendChild(content_title);
                content.appendChild(content_subtitle);

                selectorDoctors.appendChild(separator);

            });
        }
        else {
            arErrors.push({"setDoctorsToDOM":"json data is empty for dom doctors"})
        }
    }

    function setProfessionsToDOM(jsonData) {

        if (jsonData !== undefined) {
            clearNodes(selectorProfessions, selectorProfessionItem);

            Object.keys(jsonData).forEach(key => {
                let prof = jsonData[key];

                let item = document.createElement('div');
                item.tabIndex = 0;
                item.id = prof.id;
                item.dataset.id = prof.id;
                item.className = 'profession-item v-list-item v-list-item--link theme--light';
                item.title = prof.name;
                item.role = 'listitem';

                var item_content = document.createElement('div');
                item_content.className = 'v-list-item__content';
                // item_content.id = prof.id;

                var item_title = document.createElement('div');
                item_title.className = 'v-list-item__title';
                item_title.innerHTML = prof.name;
                // item_title.id = prof.id;

                selectorProfessions.appendChild(item);
                item.appendChild(item_content);
                item_content.appendChild(item_title);

            });

        } else {
            arErrors.push({"setProfessionsToDOM":"json data is empty for dom professions"})
        }
    }

    function doctorCalendar(id, year, month) {
        let i;
        let lastDate = new Date(year, month + 1, 0).getDate(),
            D = new Date(year, month, lastDate),
            lastDay = new Date(D.getFullYear(), D.getMonth(), lastDate).getDay(),
            firstDay = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
            calendar = '<tr>',
            monthDays = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

        calendarCurrentMonth = month + 1;

        let lastDateFormatted = String(lastDate);
        if (lastDateFormatted.length === 1) lastDateFormatted = "0" + lastDateFormatted;

        let monthFormatted = String(month + 1);
        if (monthFormatted.length === 1) monthFormatted = "0" + monthFormatted;

        schedulePostfields["time_start"] = "01" + "." + monthFormatted + "." + D.getFullYear() + " " + "06:00";
        schedulePostfields["time_end"] = lastDate + "." + monthFormatted + "." + D.getFullYear() + " " + "23:59";

        if (doctorsList[currentDoctorID]["avg_time"] !== undefined){
            schedulePostfields["step"] = doctorsList[currentDoctorID]["avg_time"];
        }

        getAjaxData(schedulePostfields).then(

            schedule_data => {
                let jsonData = schedule_data[currentDoctorID];
                let schedule = undefined;

                // temp
                // toggleStepDateTime("calendar");
                // temp

                if (jsonData !== undefined){
                    schedule = restructureSchedule(jsonData);
                    toggleStepDateTime("calendar");
                }else{
                    if (calendarAttempts < 2){
                        doctorCalendar("calendar", year, calendarCurrentMonth);
                        calendarAttempts += 1;
                    }else{
                        toggleStepDateTime("message");
                    }

                }

                if (firstDay !== 0) {
                    for (i = 1; i < firstDay; i++) calendar += '<td>';
                } else {
                    for (i = 0; i < 6; i++) calendar += '<td>';
                }

                let workDays = [];

                for (i = 1; i <= lastDate; i++) {

                    let isToday = (i === new Date().getDate() && D.getFullYear() === year && D.getMonth() === new Date().getMonth());
                    let isWorkedDay = false;

                    if (schedule!== undefined && schedule[calendarCurrentMonth] !== undefined && schedule[calendarCurrentMonth][i] !== undefined){
                        isWorkedDay = true;
                        workDays.push(i);
                    }
                    if (isToday && isWorkedDay) {
                        calendar += `<td><button type="button" data-day="cur_work" class="${daysClasses.btn} ${daysClasses.cur_work}"><div class="v-btn__content">${i}</div></button>`;
                    }else if (isToday && !isWorkedDay){
                        //dayTodayNoSchedule
                        calendar += `<td><button type="button" data-day="cur_nowork" class="${daysClasses.btn} ${daysClasses.cur_nowork}"><div class="v-btn__content">${i}</div></button>`;
                    }else if (!isToday && isWorkedDay){
                        // daySchedule
                        calendar += `<td><button type="button" data-day="work" class="${daysClasses.btn} ${daysClasses.work}"><div class="v-btn__content">${i}</div></button>`;
                    }else if (!isToday && !isWorkedDay){
                        // dayNoSchedule
                        calendar += `<td><button type="button" data-day="nowork" class="${daysClasses.btn} ${daysClasses.nowork}"><div class="v-btn__content">${i}</div></button>`;
                    }
                    // clothin week
                    if (new Date(D.getFullYear(), D.getMonth(), i).getDay() === 0) {
                        calendar += '<tr>';
                    }
                }
                // clothing all
                for (i = lastDay; i < 7; i++) {
                    calendar += '<td>&nbsp;';
                }

                document.querySelector('#' + id + ' tbody').innerHTML = calendar;

                monthPicker.innerHTML = monthDays[D.getMonth()] + ' ' + D.getFullYear();
                monthPicker.dataset.month = String(D.getMonth());
                monthPicker.dataset.year = String(D.getFullYear());

                // document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.month = D.getMonth();
                // document.querySelector('#' + id + ' thead td:nth-child(2)').dataset.year = D.getFullYear();

                if (document.querySelectorAll('#' + id + ' tbody tr').length < 6) {
                    document.querySelector('#' + id + ' tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
                }

                // first worked day set current
                if (workDays[0] !== undefined){
                    if (schedule[calendarCurrentMonth]!== undefined && schedule[calendarCurrentMonth][workDays[0]] !== undefined){
                        calendarCurrentDay = workDays[0];
                        setScheduleIntervalsToDOM(schedule[calendarCurrentMonth][workDays[0]]);
                        markSelectedDay(workDays[0]);
                        insertDateToCalendar();
                    }else{
                        arErrors.push({"doctorCalendar":"empty json data in schedule request"})
                    }
                }
            },
            error => arErrors.push({"getSchedule doctorCalendar":error})
        );
    }
});

