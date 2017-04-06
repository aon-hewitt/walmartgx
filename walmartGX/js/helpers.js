$(document).ready(function () {

    ///////////////////////////////////////////START////////////////////////////////////////////////////////////////////////
    //parseInclude is used to fill innerHTML of elements with external HTML/script content
    $(function () {
        $(".jsinc").each(function () {
            var el = $(this);
            var src = $(el).data('pg');

            $.get(src,
                function (data) {
                    $(el).append(data);
                }
            ); // end .post

        })
    });
    ///////////////////////////////////////////END////////////////////////////////////////////////////////////////////////


    ///////////////////////////////////////////START////////////////////////////////////////////////////////////////////////
    // Make all query string parameters available by name
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1] || 0;
        }
    }
    ///////////////////////////////////////////END////////////////////////////////////////////////////////////////////////





});