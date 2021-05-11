class Comment {
    //to change to userid
    constructor(comment, userid){
        this.comment = comment;
        this.date = new Date();
        this.userid = userid;
    }
    
}

module.exports = Comment;