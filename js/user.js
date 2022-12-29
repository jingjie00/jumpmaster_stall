//read cookie function
function read_cookie(key) {
    var result;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? (result[1]) : null;
}

//When user clicking "my detail" or "back" button, it will lauch this function.
// This will let user to choose add edit remove (at the bottom of modal)
// The modal will also let user choose the user they want to be the session.
function initialise() {
    //by default clear all the thing.(will add back later)
    $('#name_select').html('');
    $('#alert').html('');
    $('#name').val("");
    $('#email').val("");
    $('#address').val("");

    // The properties in this page, user cannot input by their own
    // User only can select the name from the select drop down list
    $('#indicate').html('Select User (For further easier)');
    $('#name').prop("disabled", true);
    $('#address').prop("disabled", true);
    $('#email').prop("disabled", true);
    $('#select_button').show(true);

    // Since no involve edit, then these button should be hidden
    $('#location').hide(true);
    $('#save').hide(true);
    $('#back').hide(true);

    // Since this is the main menu to direct to edit pages, so need these button
    $('#add').show(true);
    $('#edit').show(true);
    $('#remove').show(true);

    // By default, this button is hidden, user must have a selection of name
    // then this button only can show. (the show is in event handler below)
    $('#clearsession').hide(true);
    $('#selectsession').hide(true);

    // By default, if no any user choosen.
    $('#name').val("You no select yet");
    $('#email').val("You no select yet");
    $('#address').val("You no select yet");

    // get user from cookies (who(what name) is in the session)
    var current_user = JSON.parse(read_cookie("current_user"));
    // if user exist
    if (current_user != null) {
        // display the option for user to clear it
        $('#clearsession').show(true);
        // renew the display data (except name), (may be user ald changed or removed it)
        if (localStorage.getItem('user') != null) {
            //get from the local storage
            var str = JSON.parse(localStorage.getItem('user'));
            //check one by one of the JSON object
            for (i = 0; i < str.length; i++) {
                //if same name(the target)
                if (current_user.name == str[i].name) {
                    //renewing the cookie object
                    current_user.email = str[i].email;
                    current_user.address = str[i].address;
                    //display it
                    $('#name').val(current_user.name);
                    $('#email').val(current_user.email);
                    $('#address').val(current_user.address);
                    //save back to cookies
                    document.cookie = "current_user=" + JSON.stringify(current_user);
                    break;
                }
            }
        }
    } else //if no user exist, then hide the clear session button, no thing to clear
        $('#clearsession').hide(true);


    // for the name selection drop down list
    $('#name_select').html('');
    // get user from local storage
    if (localStorage.getItem('user') != null) { //if local storage have thing
        var str = JSON.parse(localStorage.getItem('user'));
        //should the select button
        $('#select_button').show(true);
        //build the select name button drop down list
        for (i = 0; i < str.length; i++) {
            $('#name_select').append('<div id="n' + i + '" class="dropdown-item"><a id="ns' + i + '"  href="#">' + str[i].name + '</a></div>');
            const user = str[i];
            const index = i;
            // Autofill the field if name is clicked
            $('#ns' + index).click(function () {
                $('#name').val(user.name);
                $('#address').val(user.address);
                $('#email').val(user.email);
                $('#selectsession').show(true);
            });
        }
    } else { // if local storage have no thing
        //hide the select and clear session button, as it does not needed.
        $('#clearsession').hide(true);
        $('#selectsession').hide(true);

        //hide the edit and remove button, as it nothing to edit nor delete
        $('#remove').hide(true);
        $('#edit').hide(true);

        //notify user go to add
        $('#alert').html('<div class="alert alert-primary" role="alert">Please go to add user before proceed here</div>');
    }

    // event handler, if clicked 
    
    // save all into cookies
    $('#selectsession').click(function () {
        //get data from text box
        var name_temp = $('#name').val();
        var address_temp = $('#address').val();
        var email_temp = $('#email').val();
        // check if exist
        if (name_temp == "") {
            alert("Select a valid name");
        } else {
        //after confirm okay, prepare object and save
            const user = {
                name: name_temp,
                address: address_temp,
                email: email_temp,
            };
            document.cookie = "current_user=" + JSON.stringify(user);
            alert("Hi, " + user.name + ". Welcome!");
            location.reload();
        }
    });

    // clear from session storage
    $('#clearsession').click(function () {
        document.cookie = "current_user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"; //set to pass date, mean removed
        //make all to empty
        $('#name').val("");
        $('#email').val("");
        $('#address').val("");
        $('#clearsession').hide(true);

        //alert success and reload
        alert("Hi, Successfully cleared the session");
        location.reload();
    });
}

//launch initialise
$('#detail').click(function () {
    initialise();
});

//launch initialise. Every back button have same properties
$('#back').click(function () {
    initialise();
});

//add situation
$('#add').click(function () {
    // The propertise and UI in this page, user can edit any text box of it
    $('#indicate').html('Add User');
    $('#name').prop("disabled", false);
    $('#address').prop("disabled", false);
    $('#email').prop("disabled", false);

    // because of adding, there no need select drop down button
    $('#select_button').hide(true);

    // Able to let user input from Maps
    $('#location').show(true);

    // Save or back is required. (the event handler of click at the back)
    $('#save').show(true);
    $('#back').show(true);

    // Since the layout of select session is no longer needed, hide all
    $('#add').hide(true);
    $('#edit').hide(true);
    $('#remove').hide(true);
    $('#clearsession').hide(true);
    $('#selectsession').hide(true);

    // Made all empty
    $('#name').val("");
    $('#email').val("");
    $('#address').val("");

    //save event handler
    $('#save').click(function () {
        //get value
        var name_temp = $('#name').val();
        var address_temp = $('#address').val();
        var email_temp = $('#email').val();

        // check the validity of info
        // no empty string and correct email address
        if (name_temp == "" || address_temp == "" || email_temp == "") {
            $('#alert').html('<div class="alert alert-danger" role="alert">Fill all the related fill!</div>');
        } else if (email_temp.indexOf("@") == -1) {
            $('#alert').html('<div class="alert alert-danger" role="alert">Email must have a "@"!</div>');
        } else {
        // if okay, the continue with adding
        // declare object and assign value
            const user = {
                name: name_temp,
                address: address_temp,
                email: email_temp,
            };
            // get JSON array from local storage
            //if exist of JSON array
            if (localStorage.getItem('user') != null) {
                var str = JSON.parse(localStorage.getItem('user'));
                var i;
                // Loop to check for duplicate
                for (i = 0; i < str.length; i++) {
                    if (str[i].name == name_temp) {
                        $('#alert').html('<div class="alert alert-danger" role="alert">Duplicate Name!</div>');
                        break;
                    }
                }
                //append, if not exist(no duplicate)
                if (i == str.length) {
                    str.push(user);
                    //save back into the storage
                    localStorage.setItem("user", JSON.stringify(str));
                    alert("Successfully added. Reloading...");
                    location.reload();

                }

            } else { //if the no have any user record
                // create a JSON array with one element and save
                localStorage.setItem("user", JSON.stringify([user]));
                location.reload();
            }
        }

    });

});

//edit situation
$('#edit').click(function () {
    // The edit page properties
    // only the name text box is disable, as other need to edit
    $('#indicate').html('Edit User');
    $('#name').prop("disabled", true);
    $('#address').prop("disabled", false);
    $('#email').prop("disabled", false);

    // select button is required, it only allow for existing data
    // auto fill from maps is needed so show the button
    $('#select_button').show(true);
    $('#location').show(true);
    $('#save').show(true);
    $('#back').show(true);
    
    // other select session page layout is no important
    $('#clearsession').hide(true);
    $('#selectsession').hide(true);
    $('#add').hide(true);
    $('#edit').hide(true);
    $('#remove').hide(true);

    // make empty
    $('#name').val("");
    $('#email').val("");
    $('#address').val("");

    // Prepare name select drop down list
    $('#name_select').html('');
    //get user in local storage
    if (localStorage.getItem('user') != null) {
        var str = JSON.parse(localStorage.getItem('user'));
        //show the select button if exist
        $('#select_button').show(true);
        //Preparing drop down list
        for (i = 0; i < str.length; i++) {
            $('#name_select').append('<div id="n' + i + '" class="dropdown-item"><a id="ns' + i + '"  href="#">' + str[i].name + '</a></div>');
            const user = str[i];
            const index = i;
            // autofill detail when a name is clicked
            $('#ns' + index).click(function () {
                $('#name').val(user.name);
                $('#address').val(user.address);
                $('#email').val(user.email);
                $('#alert').html('<div class="alert alert-success" role="alert">Successfully retrieved!</div>');
            });
        }
    }

    // save button event handler
    $('#save').click(function () {
        //get all the value
        var name_temp = $('#name').val();
        var address_temp = $('#address').val();
        var email_temp = $('#email').val();
        //check validity (no null and must have @ in email)
        if (name_temp == "" || address_temp == "" || email_temp == "") {
            $('#alert').html('<div class="alert alert-danger" role="alert">Fill all the related field!</div>');
        } else if (email_temp.indexOf("@") == -1) {
            $('#alert').html('<div class="alert alert-danger" role="alert">Email must have a "@"!</div>');
        } else {
            //if no problem
            //get all user detail( the JSON object array from storage)
            var str = JSON.parse(localStorage.getItem('user'));
            var i;
            for (i = 0; i < str.length; i++) {
                // after find the matched name, modify it
                if (str[i].name == name_temp) {
                    str[i].address = address_temp;
                    str[i].email = email_temp;
                }
            }
            // save back to storage and reload
            localStorage.setItem("user", JSON.stringify(str));
            location.reload();
        }

        //renew the current user(in the cookies)
        //get the cookies name
        var current_user = JSON.parse(read_cookie("current_user"));
        if (current_user != null) {
            if (localStorage.getItem('user') != null) {
                var str = JSON.parse(localStorage.getItem('user'));
                for (i = 0; i < str.length; i++) {
                    //if find the matched name, edit the cookies
                    if (current_user.name == str[i].name) {
                        current_user.email = str[i].email;
                        current_user.address = str[i].address;

                        $('#name').val(current_user.name);
                        $('#email').val(current_user.email);
                        $('#address').val(current_user.address);
                        // save back to cookies
                        document.cookie = "current_user=" + JSON.stringify(current_user);
                        break;
                    }
                }
            }
        }
    });
});

// remove situation
$('#remove').click(function () {
    //The properties of this pages. Disable all the text filed
    $('#indicate').html('Remove User');
    $('#name').prop("disabled", true);
    $('#address').prop("disabled", true);
    $('#email').prop("disabled", true);

    // Location is no need, and the select session is no need
    $('#location').hide(true);
    $('#clearsession').hide(true);
    $('#selectsession').hide(true);

    // save and back button is needed
    $('#save').show(true);
    $('#back').show(true);
    $('#select_button').show(true);
   
    // made all empty
    $('#name').val("");
    $('#email').val("");
    $('#address').val("");

    // no need in remove session
    $('#add').hide(true);
    $('#edit').hide(true);
    $('#remove').hide(true);

    // prepareing the name select select drop down list
    $('#name_select').html('');
    if (localStorage.getItem('user') != null) { //if exist
        //get in local storage
        var str = JSON.parse(localStorage.getItem('user'));
        $('#select_button').show(true);
        for (i = 0; i < str.length; i++) {
            $('#name_select').append('<div id="n' + i + '" class="dropdown-item"><a id="ns' + i + '"  href="#">' + str[i].name + '</a><button id="nd' + i + '" type="button" class="close">&times;</button></div>');
            const user = str[i];
            const index = i;

            // when click the name, it will show the detail in text box, (same as edit)
            $('#ns' + index).click(function () {
                $('#name').val(user.name);
                $('#address').val(user.address);
                $('#email').val(user.email);
                $('#alert').html('<div class="alert alert-success" role="alert">Successfully retrieved!</div>');
            });

            // when click the "x", it will remove the name as also detail
            $('#nd' + index).click(function () {
                $('#name').val("");
                $('#email').val("");
                $('#address').val("");
                $('#n' + index).hide(true);
                // Get the current user in cooies, to check if the cookies is needed to remove or not
                var current_user = JSON.parse(read_cookie("current_user"));
                if (current_user == null)
                    current_user = "";
                var strs = JSON.parse(localStorage.getItem('user'));
                var j = 0;
                for (j = 0; j < strs.length; j++) {
                    if (strs[j].name == user.name) {
                        // if cookie need to be remove, just made it expired, then it will remove automatically
                        if (current_user.name == user.name)
                            document.cookie = "current_user= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
                        
                        // if the JSON object in local storage only have one, just remove the entire array 
                        // (if the name to remove is the only node)
                        if (strs.length == 1) {
                            localStorage.removeItem("user");
                            break;
                        }
                        // if not, then delete the node and save into the local storage again
                        strs.splice(j, 1);
                        localStorage.setItem("user", JSON.stringify(strs));
                        break;
                    }
                }
                // inform user
                $('#alert').html('<div class="alert alert-success" role="alert">Successfully remove in storage!</div>');
            });
        }
    }

    // when clicked save return to index (close the model and refresh the page)
    $('#save').click(function () {
        location.reload();
    });
});




//Get location from maps API, to get autofill address

//call the function below
$('#location').click(function () {
    getLocation();
    $('#address').val("Waiting From Respond...");
});

// will be call by event handler
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation
            .getCurrentPosition(successCallback, console.log); //continue with the successCallback below
    } else {
        alert("Fail to retrieve data from");
    }
}
const successCallback = (position) => {
    const { latitude, longitude } = position.coords;
    //using latitude and longitude to retrieve the wording addresses.
    $.getJSON("https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + "&key=bc0d46fe060c4d9eace95ac89ff83e46&language=de&limit=1", function (data) {
        console.log(data);
        var addr = data.results[0].formatted;
        // after get address, fill inside
        $('#address').val(addr);
    });

}




//email part (bottom)
function handleForm(event) { event.preventDefault(); }
// if clicked event handler
document.getElementById('emailsubmit').addEventListener('click',function(){
    alert('Submitting');
    var str = document.getElementById("sendemail").value;
    var test = localStorage.getItem("email");
    if (test == null)
        test = [];
    //prevent spam
    if (test.includes(str)) {
        if (confirm("The email had sent. Please dont use me to spam. Are you sure to send again")) {
            alert("Hi customer, sending email to: " + str + ", please wait for few second");
        } else {
            return;
        }
    }

    // send email with smtp script
    Email.send({
        Host: "smtp.gmail.com",
        Username: "jumpmasterweb@gmail.com",
        Password: "mqwfqemnrnxocrqn", //using email temp password but not the account password
        To: str,
        From: "jumpmasterweb@gmail.com",
        Subject: "Query about the the pasar malam website?",
        Body: "<h1>Dear Valued Customer,\n</h1><p>Here are the email that you can query!</p><img src='https://jumpmaster.azurewebsites.net/images/logo.png' alt='Logo'><p>Thank you</p>",
        defaultCredentials: "true",
        enableSsl: "true"
    }).then(
        message => alert("Hi customer, the email is as following status: " + message)
    );
    if (typeof (Storage) !== "undefined") {
        // Store in to local storage (just to prevent spamming)
        var email = localStorage.getItem("email", str);
        var array=[];
        if(email!=null)
            array = email.concat(str)
        else
            array=[str];
        localStorage.setItem("email", array);
    }
    document.getElementById("sendemail").value = "";
    location.reload();
})

var prevScrollpos = window.pageYOffset;
window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;
    if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.top = "0";
    } else {
        document.getElementById("navbar").style.top = "-200px";
    }
    prevScrollpos = currentScrollPos;
}


