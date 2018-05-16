$(function () {

    ajax(5);

    function ajax(e) {
        $.ajax({
            url: 'http://frontend-test.pingbull.com/pages/stepan.bondarenkoo@gmail.com/comments',
            cache: false,
            type: 'GET',
            data: {
                count: e,
                offset: 0
            },
            success: successResponse
        });
    }

    function count() {
        $.ajax({
            url: 'http://frontend-test.pingbull.com/pages/stepan.bondarenkoo@gmail.com/comments',
            type: 'GET',
            data: {
                count: 999999999
            },
            success: function (data) {
                $('.commentsCounter span').html(data.length);
                if (data.length == 1) {
                    $('.commentsCounter').html(data.length + " comment");
                }
            },
        });
    }

    function successResponse(data) {
        const html = data.map(comment);
        $('#comments').html(html);
        replyForSubComments();
        checkUser();
        documentReady();
        count();

    }

    function comment(data) {
        return `<div class="parentWrapper">
                    <div class="user" id="${data.author.id}"  data-id="${data.id}"> 
                    <div class="avatar"><img src="${data.author.avatar}" alt=""></div>
                    <div class="form__wrapper">
                    
                    <div class="form__title">
                        <div class="form__title-name parent">${data.author.name}</div>
                        <div class="text__info"><i class="far fa-clock"></i>${formatDate(data.created_at)}</div>
                    </div>
                    <div class="form__content">${data.content}</div>
                      <div class="form__btn">
                        <button class="text__info edit" disabled><i class="fas fa-edit"></i>Edit</button>
                        <button class="text__info delete" disabled><i class="fas fa-times"></i>Delete</button>
                        <button class="text__info reply" ><i class="fas fa-reply"></i>Reply</button>
                      </div>
                    </div>
                  </div>
                  <div class="input__wrapper clearfix"></div>
                    <ul>
                     ${data.children.map(subComment).join('')}
                    </ul>
                </div>`;
    }

    function subComment(data) {
        return `<li class="user" id="${data.author.id}" data-id="${data.id}"> 
                    <div class="avatar avatar-small"><img src="${data.author.avatar}" alt=""></div>
                    <div class="form__wrapper">
                        <div class="form__title">
                            <div class="form__title-name"> ${data.author.name}</div>
                            <div class="form__reply"><i class="fas fa-share"></i><span></span></div>
                            <div class="text__info"><i class="far fa-clock"></i>${formatDate(data.created_at)}</div>
                        </div>
                        <div class="form__content">${data.content}</div>
                    </div>
                </li>`
    }

    function replyForSubComments() {
        $('.parentWrapper').each(function () {
            var parentName = $(this).find('.form__title-name.parent').text();
            $(this).find('.form__reply span').text(parentName);
        });
    }

    function checkUser() {
        $('div.user').each(function () {
            if ($('.comments-new').data('id') == $(this).attr('id')) {
                $(this).find('.text__info').removeAttr('disabled');
            }
        });
    }

    $("#comment-reply").submit(function (e) {
        send(null, null);
        e.preventDefault();
    });

    function send(id, mydata) {
        console.log(21212112);
        if (!mydata) {
            var mydata = $("#mydata").val();
        }
        $.ajax({
            type: "POST",
            url: 'http://frontend-test.pingbull.com/pages/stepan.bondarenkoo@gmail.com/comments',
            data: {
                content: mydata,
                parent: id || null
            }
        });
        $("#mydata").val('');
        setTimeout(function () {
            ajax(addComment);
        }, 500);
        return false;
    }

    function formatDate(date) {
        const parsedDate = new Date(date);

        const fullYear = parsedDate.getFullYear();
        const month = ("0" + (parsedDate.getMonth() + 1)).slice(-2);
        const day = ("0" + parsedDate.getDate()).slice(-2);
        const hours = ("0" + parsedDate.getHours()).slice(-2);
        const minutes = ("0" + parsedDate.getMinutes()).slice(-2);

        return `${fullYear}-${month}-${day} at ${hours}:${minutes}`;
    }

    var addComment = 5;

    $("#loadMore").click(function (e) {
        e.preventDefault();
        addComment = addComment + 5;
        ajax(addComment);
    });

    function deleteComment(id) {
        $.ajax({
            url: 'http://frontend-test.pingbull.com/pages/stepan.bondarenkoo@gmail.com/comments/' + id,
            type: 'POST',
            dateType: 'json',
            data: {
                _method: 'DELETE'
            },
            success: function (result) {
                ajax(addComment);
            }
        });
    }
    function edit(id, content) {

        const messageReply = `
                <div id="reply-block" class="form__wrapper">
                <div class="top__info">
                    <div class="form__reply"><i class="fas fa-share"></i><span></span></div>
                    <div id="cancel" class="text__info"><i class="fa fa-times"></i><span>Cancel</span></div>
                </div>
                 <textarea placeholder="Your  Message" id="comment-reply-message" >${content}</textarea>
                 <button id="send-comment-button" >Send</button> 
                </div>`;

        $('.user').each(function () {
            if ($(this).data('id') == id) {
                $(this).next('.input__wrapper').html(messageReply);
            }
        });

        if (content) {
            $("#send-comment-button").on('click', function () {
                content = $('#comment-reply-message').val();
                saveEditComment(id, content);
                return false;
            });
        }

        document.addEventListener('click', cancelReply);
    }

    function reply(id) {
        console.log(id);
        setTimeout(function () {
            $("#send-comment-button").on('click', function () {
                const mydata = $('#comment-reply-message').val();
                send(id, mydata);
                return false;
            });
        }, 200);



        const messageReply = `
                <div id="reply-block" class="form__wrapper">
                <div class="top__info">
                    <div class="form__reply"><i class="fas fa-share"></i><span></span></div>
                    <div id="cancel" class="text__info"><i class="fa fa-times"></i><span>Cancel</span></div>
                </div>
                 <textarea placeholder="Your  Message" id="comment-reply-message" ></textarea>
                 <button id="send-comment-button" >Send</button> 
                </div>`;

        $('.user').each(function () {
            if ($(this).data('id') == id) {
                console.log('show input');
                $(this).next('.input__wrapper').html(messageReply);
            }
        });

        document.addEventListener('click', cancelReply);
    }

    function cancelReply() {
        $(document).mouseup(function (e) {
            var form = $("#reply-block");
            if (!form.is(e.target)
                && form.has(e.target).length === 0) {
                form.remove();
            }
        });
    }
    function cancel() {
        var form = $("#reply-block");
        form.remove();
    }


    function saveEditComment(id, content) {
        $.ajax({
            url: 'http://frontend-test.pingbull.com/pages/stepan.bondarenkoo@gmail.com/comments/' + id,
            type: 'POST',
            dateType: 'json',
            data: {
                _method: 'PUT',
                content: content
            },
            success: function (result) {
                ajax(addComment);
            }
        });
    }

    function documentReady() {
        $(".delete").on('click', function () {
            const id = $(this).closest('.user').data('id');
            deleteComment(id);
        });

        $(".edit").on('click', function () {
            const id = $(this).closest('.user').data('id');
            const content = $(this).closest('.user').find('.form__content').text();
            edit(id, content);
            $('.form__reply').remove();
            $("#cancel").on('click', function () {
                cancel();
            });
        });

        $(".reply").on('click', function () {
            const id = $(this).closest('.user').data('id');
            reply(id);
            replyForSubComments();
            $("#cancel").on('click', function () {
                cancel();
            });
        });
    }


});