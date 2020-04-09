$(document).ready(function() {
  // POST called
    $('#submitbutt').click(function() {
        // Get the data from the form
        var em = $('#em').val(); 
        var name = $('#un').val();
        var pw = $('#pw').val();
        var rpw = $('#rpw').val();
        console.log("Register: Reached submit");

        var newUser = {
          email: em,
          username: name,
          password: pw
        };

        $.post('addUser', newUser, function(data, status) {
          console.log(data);
        });
      });
    
    $('#loginbtn').click(function() {
        var un = $('#userLog').val();
        var pw = $('#passLog').val();
        console.log("Login: Reached submit");
        
        var user = {
            username: un,
            password: pw
        };
        
        $.post('login', user, function(data, status) {
            console.log(data);
        });
    });
    
    $('#buttpost').click(function() {
        var titl = $('#titl').val();
        var cap = $('#cap').val();
        var img = $('#img').val();
        
        
        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();

        var dat = d.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
        
        console.log(dat);
        
        console.log("New Post: Reached submit");
        
        var newPost = {
            date: dat,
            image: img,
            title: titl,
            caption: cap
        };
        
        $.post('createPost', newPost, function(data, status) {
            console.log(data);
        });
    });
});