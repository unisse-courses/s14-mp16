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
    
    function addPostDiv(item, parentDiv){
        var contentContainer = document.createElement('div');
        var postHeader = document.createElement('div');
        var bananasDiv = document.createElement('div');
        var postFooter = document.createElement('div');
        var imageCaptionDiv = document.createElement('div');
        var iconsDiv = document.createElement('div');
        var applesDiv = document.createElement('div');
        
        var img = document.createElement('img');
        var captionP = document.createElement('p');
        var usernameP = document.createElement('p');
        var dateP = document.createElement('p');
        var postTitle = document.createElement('p');
        
        $(contentContainer).addClass("contentContainer");
        $(postHeader).addClass("postHeader");
        $(bananasDiv).addClass("bananas");
        $(postFooter).addClass("postFooter");
        $(imageCaptionDiv).addClass("imgCap");
        $(iconsDiv).addClass("icons");
        $(applesDiv).addClass("apples");
        
        
        $(img).attr("src", item.img);
        $(postTitle).text(item.title);
        $(captionP).text(item.caption);
        $(usernameP).text(item.username);
        $(dateP).text(item.date);
        
        bananasDiv.append(usernameP);
        bananasDiv.append(dateP);
        
        postHeader.append(bananasDiv);
        
        imageCaptionDiv.append(img);
        imageCaptionDiv.append(postTitle);
        imageCaptionDiv.append(captionP);
        
        postFooter.append(iconsDiv);
        postFooter.append(applesDiv);
    }
    
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