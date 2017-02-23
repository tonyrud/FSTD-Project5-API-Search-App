(function ($) {

    let $searchField = $('#search'),
        $albums = $('#albums'),
        $message = $('.desc'),
        albumDetails = [],
        clickedIndex;

    $('form').submit(function (e) {
        e.preventDefault();

        let searchedText = $searchField.val(),
            noAlbums = 'No albums found that match: ',
            emptySearch = '<p>Nothing in search field!</p>',
            //add message function with default params
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

        let clickedIndex = $(this).index();

        let album = albumDetails[clickedIndex];

        ajaxTracksCall(album.id)
            .then(generateAlbumDetails);
    });

    $("body").on('click', '.back-link', function (e) {
        e.preventDefault();
        $(this).parent().parent().fadeOut(400);
    });

    /*check if there are albums from the searched input,
    return nothing to throw catch error in promise*/
    let checkData = (data) => !data.albums.items.length ? "" : data;

    let ajaxCall = query => {
        return new Promise((resolve, reject) => {
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

    //Ajax call for track info
    let ajaxTracksCall = item => {
        // let imageId = album.id;
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'https://api.spotify.com/v1/albums/' + item,
                success: resolve
            });
        })
    };

    let generateGallery = data => {
        let albums = data.albums.items,
            htmlString = "";
        //clear album array    
        albumDetails = [];

        albums.forEach(album => {
            //add current album to album array
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

    let generateAlbumDetails = album => {
        let htmlString = "";
        htmlString += `
        <section id='overlay'>
            <div class="overlay-content">
            <a href='#' class="back-link">
                <i class="material-icons">arrow_back</i><span>Search Results</span>
            </a>
            <div class="album-info">
                <figure class="album-cover">
                    <img src="${album.images[0].url}" alt="">
                </figure>
                <div class="album-details">
                <h1>${album.name} (${album.release_date.slice(0, 4)})</h1>
                <a  href="${album.external_urls.spotify}"  target="_blank">
                    <p class="ext-link"><i class="material-icons">link</i><span>${album.artists[0].name}</span></p>
                </a>
                <ul class="tracks">
                ${createTracks(album.tracks.items)}
                </ul>
                </div>
            </div>
            </div>
        </section>`;
        appendAlbumDetails(htmlString);
    }

    let createTracks = tracks => {
        let trackString = '';
        tracks.forEach((track) => {
            trackString += `
                <li class="track">${track.track_number} ${track.name}</li>
                `
            });
            return trackString;
        };

        let appendItems = content => {
            //remove animation class to animate out
            $('#albums > li').removeClass('album-animate');
            //wait, then add everything
            setTimeout(() => {
                //clear albums
                $albums.empty();
                $('#overlay').fadeOut(200);
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
        };

        let appendAlbumDetails = content => {
            //add album detail page
            $('#overlay').remove();
            $('.main-content').append(content).hide().fadeIn(400);
        };
    })(jQuery);
