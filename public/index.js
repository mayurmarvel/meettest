const meetUrl = document.getElementById('meet-url');

const meetName = document.getElementById('meet-name');

const generatedLink = document.getElementById('generated-link');

const copyLink = document.getElementById('btn-copy-link');

const sharelink = document.getElementById('btn-share-link');

const createLink = document.getElementById('btn-create-link');

const getExtension = document.getElementById('getExtension');

const invalidUrlMsg = document.getElementById('invalidUrlMsg');

const invalidNameMsg = document.getElementById('invalidNameMsg');

const linkCopiedMsg = document.getElementById('linkCopiedMsg')

const genLinkBox1 = document.getElementById('link-generated-div');

const genLinkBox2 = document.getElementById('gen-form-div');

const expiryNote = document.getElementById('expiry-note');

const gmeetSample = "meet.google.com";

const zmeetSample = "zoom.us";

const airmeetSample = "www.airmeet.com";

const smeetSample = "join.skype.com";

console.log(expiryNote, genLinkBox1, genLinkBox2);




const validateUrl = function () {
    if (meetUrl.value.toLowerCase().includes(gmeetSample) || meetUrl.value.toLowerCase().includes(zmeetSample) || meetUrl.value.toLowerCase().includes(airmeetSample) || meetUrl.value.toLowerCase().includes(smeetSample)) {
        invalidUrlMsg.classList.add('hidden')
        console.log(true);
        return true

    } else {
        invalidUrlMsg.classList.remove('hidden')
        console.log(false);
        return false

    }

}

const validateMeetName = function () {

    if (meetName.value.toLowerCase().match(/^([a-z0-9]{5,})$/)) {
        invalidNameMsg.classList.add('hidden')
        //console.log('Valid');
        return true
    } else {
        invalidNameMsg.classList.remove('hidden')
        //console.log('In-Valid');
        return false
    }


}



meetUrl.addEventListener("keyup", function (e) {
    //console.log(meetUrl.value);
    validateUrl()
    if (meetUrl.value == "") {
        invalidUrlMsg.classList.add('hidden')
    }


});



meetName.addEventListener("keyup", function (e) {
    // console.log(meetName.value);

    validateMeetName();

    if (meetName.value == "") {
        // invalidUrlMsg.classList.add('hidden')
    }


});


createLink.addEventListener('click', (e) => {
    e.preventDefault();

    console.log("Clicked");

    if (validateUrl() && validateMeetName()) {
        console.log("Submit Allowed");

        createLinkCall();

    } else {

        console.log("Submit Not allowed")
        alert("Enter Valid Meet URL & Name")

    }


})


const showOutput = function () {
    genLinkBox1.classList.remove('hidden');
    genLinkBox2.classList.remove('hidden');
    expiryNote.classList.remove('hidden')

    genLinkBox1.scrollIntoView();

}

const hideOutput = function () {
    genLinkBox1.classList.add('hidden');
    genLinkBox2.classList.add('hidden');
    expiryNote.classList.add('hidden')

}

let createLinkCall = function () {

    console.log(meetUrl.value, meetName.value);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                "url": `${meetUrl.value.toLowerCase()}`,
                "slug": `${meetName.value.toLowerCase()}`
            })
    };


    fetch('http://127.0.0.1/url', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.message) {

                console.log("error");
                hideOutput();
                alert("Try Some Other Meeting Name!")

            } else {

                console.log(data);



                generatedLink.value = `127.0.0.1/${data.created.slug}`

                showOutput();


            }

        });




}



copyLink.addEventListener('click', function (e) {

    navigator.clipboard.writeText(generatedLink.value);

    linkCopiedMsg.classList.remove('hidden')


});


sharelink.addEventListener('click', function (e) {

    navigator.clipboard.writeText(generatedLink.value);
    linkCopiedMsg.classList.remove('hidden')

    const shareData = {
        title: 'Meeting',
        text: `${meetName.value} `,
        url: `http://127.0.0.1:8080/${meetName.value}`
    }

    navigator.share(shareData).then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));


});

const comingSoon = function () {
    alert("Coming Soon!")
}