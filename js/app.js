

let $searchField = $('#search');


$('form').submit(function (e) {
    e.preventDefault();

    $('.desc').hide();

    //run ajax function from seach val
    if ($searchField.val().length > 0) {
        ajaxCall($searchField.val())
            .then(generateGallery);
    }
});

let ajaxCall = function (query) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'album'
            },
            success: resolve
        });
    });
};

function generateGallery(data) {
    let albums = data.albums.items,
        images = 0,
        htmlString = ``,
        animArray = [];

    albums.forEach(function (album) {

        htmlString += `
        <li class='album'>
            <div class="album-wrap">
                <img class="album-art" src="${album.images[1].url}">
            </div>
            <span class="album-title">${album.name}</span>
            <span class="album-artist">${album.artists[0].name}</span>
        </li>`
        // animArray.push(htmlString);
    });
    appendItems(htmlString)
}

function appendItems(content) {

    $('#albums').append(content);
    $('#albums > li').each(function (i) {
        var $item = $(this);
        setTimeout(function () {
            $item.addClass('album-animate');
        }, 100 * i);
    });




    // $('.album').addClass('album-animate')
}