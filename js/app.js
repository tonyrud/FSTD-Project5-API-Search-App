(function ($) {

    let $searchField = $('#search'),
        $albums = $('#albums'),
        $message = $('.desc'),
        albumDetails = [],
        clickedIndex,
        albumClicked = false;



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

    $albums.on('click', '.album', function (e) {
        e.preventDefault();

        let imageSelected = $(this).find('.album-artist'),
            clickedIndex = $(this).index();


        generateAlbumDetails(clickedIndex);
    });

    $("body").on('click', '.back-link', function (e) {
        e.preventDefault();
        $(this).parent().parent().fadeOut(400);


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
        //clear album array    
        albumDetails = [];

        albums.forEach((album) => {

            albumDetails.push(album);

            htmlString += `
            <li class='album'>
                <div class="album-wrap">
                    <a href="#">
                        <img class="album-art" src="${album.images[0].url}">
                    </a>
                    <div class="album-overlay">
                        <p>Click for details</p>
                    </div>
                </div>
                <span class="album-title">${album.name}</span>
                <span class="album-artist">${album.artists[0].name}</span>
            </li>`
        });
        appendItems(htmlString);
        return albumDetails;
    }

    let generateAlbumDetails = (index) => {
        let album = albumDetails[index],
            htmlString = "";

        albumClicked = true;

        htmlString += `
        <section id='overlay'>
            <div class="overlay-content">
            <a href='#' class="back-link">
                <p class="back-search"><i class="material-icons">arrow_back</i><span>Search Results</span></p>
            </a>
            <div class="album-info">

                <figure class="album-cover">
                    <img src="${album.images[0].url}" alt="">
                </figure>
                <div class="album-details">
                <h1>${album.name}(YEAR)</h1>
                <a  href="${album.external_urls.spotify}"  target="_blank">
                    <p class="ext-link"><i class="material-icons">link</i><span>${album.artists[0].name}</span></p>
                </a>
                <ul class="tracks">
                    <li class="track">Track</li>
                    <li class="track">Track</li>
                    <li class="track">Track</li>
                    <li class="track">Track</li>
                    <li class="track">Track</li>
                    <li class="track">Track</li>
                    <li class="track">Track</li>
                    <li class="track">Track</li>
                </ul>
                </div>
            </div>
            </div>
        </section>`;
        appendAlbumDetails(htmlString);
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

    let appendAlbumDetails = (content) => {
        //add albums
        $('.main-content').after(content);
    };
})(jQuery);
