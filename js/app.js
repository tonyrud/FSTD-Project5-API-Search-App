(function ($) {

    let $searchField = $('#search'),
        $albums = $('#albums'),
        $message = $('.desc');



    $('form').submit(function (e) {
        e.preventDefault();

        let searchedText = $searchField.val(),
            noAlbums = 'No albums found that match: ',
            emptySearch = '<p>Nothing in search field!</p>',
            addMessage = (icon = 'help', html = noAlbums, message = searchedText) => {
                return `<li class='no-albums'>
                    <i class='material-icons icon-help'>${icon}_outline</i>${html} <strong>${message}</strong>.
                </li>`;
            }
        $message.detach();

        //run ajax function from seach val
        if (searchedText.length) {
            ajaxCall(searchedText)
                .then(checkData)
                .then(generateGallery)
                .catch((err) => {
                    $albums.empty();
                    $albums.append(addMessage());
                });
        } else {
            $albums.empty();
            $albums.append(addMessage('error', emptySearch, "Please enter a search query"));
        }
    });

    /*check if there are albums from the searched input,
    return nothing to throw catch error in promise*/
    let checkData = (data) => !data.albums.items.length ? "" : data;

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

    let generateGallery = (data) => {
        let albums = data.albums.items,
            htmlString = "";

        albums.forEach((album) => {

            htmlString += `
        <li class='album'>
            <div class="album-wrap">
                <img class="album-art" src="${album.images[0].url}">
                <div class="album-overlay">
                <a href="${album.external_urls.spotify}" target="_blank">
                    <p>
                        Click Here for more info
                    </p>
                </a>
            </div>
            </div>
            <span class="album-title">${album.name}</span>
            <span class="album-artist">${album.artists[0].name}</span>
        </li>`
        });
        appendItems(htmlString);
    }

    let appendItems = (content) => {
        //remove animation class to animate out
        $('#albums > li').removeClass('album-animate');
        //wait, then add everything
        setTimeout(() => {
            //clear albums
            $albums.empty();
            //add albums
            $albums.append(content);
            //animate albums in
            $('#albums > li').each(function (i) {
                var $item = $(this);
                setTimeout(function () {
                    $item.addClass('album-animate');
                }, 100 * i);
            });
        }, 400);
    }
})(jQuery);
