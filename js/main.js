let game = {
        cs: 85, // cell size
        rows: 4,
        cols: 4,
        loading: false,
    },
    bgs = 20;
(function ($) {
    let gs = $('#game'),
        gi = null,
        settings = $('#settings');
    game.bg = 'img/'+ (Math.floor(Math.random() * bgs)) +'.jpg';

    gs
        .on('click', '.cell', function (e) {
            e.preventDefault();
            if(game.loading) return false;
            if(!canMove($(this).attr('data-index'))) return false;

            let t = game.blank
            move($(this), game.blank);
            game.loading = true;
            game.blank = parseInt($(this).attr('data-index'));
            $(this).attr('data-index', t);

            if(checkWin()) {
                setTimeout(function() {
                    game_over();
                }, 300);
            } else {
                setTimeout(function() {
                    game.loading = false;
                }, 200);
            }
        })
        .on('contextmenu', '.cell', function (e) {
            e.preventDefault();
        });

    settings
        .on('click', 'button', function(e) {
            e.preventDefault();
            if($(this).hasClass('active')) return false;
            if(confirm('End current game and change difficulty?')) {
                settings.find('.active').removeClass('active');
                $(this).addClass('active');
                $('#solution_wrapper').remove();
                gs.html('');
                init();
            }
        });

    function init() {
        prepare();
        draw_solution();
        start();
    }

    function prepare() {
        let mw = $(window).outerWidth(),
            mode = settings.find('.active');
        mw = mw > 500 ? 500 : mw-10;
        game.cols = parseInt(mode.data('cols'));
        game.rows = parseInt(mode.data('rows'));
        game.cs = Math.floor(mw / game.cols);
        game.cs = game.cs > 100 ? 100 : game.cs;
    }

    function start() {
        let cells = game.rows * game.cols,
            key = generate(cells);
        game.blank = cells - 1;
        draw_cells(key);
        gs.addClass('ready');
    }

    function moveBg(elem, pos) {
        let row = parseInt(pos / game.rows),
            col = pos % game.cols,
            img = gi.clone().attr('id', '');
        img.css({
            position: 'absolute',
            top: '-' + (row * game.cs) + 'px',
            left: '-' + (col * game.cs) + 'px'
        });
        img.appendTo(elem.find('.cell-img'));
    }

    function move(elem, pos) {
        let row = parseInt(pos / game.rows),
            col = pos % game.cols;
        elem.css({
            top: row * game.cs + 'px',
            left: col * game.cs + 'px'
        });
    }

    function canMove(i) {
        let row = parseInt(game.blank / game.rows),
            col = game.blank % game.cols,
            v = [];
        // x axis
        if(col === game.cols - 1) {
            v.push(game.blank -1);
        } else if(col === 0) {
            v.push(game.blank +1);
        } else {
            v.push(game.blank -1);
            v.push(game.blank +1);
        }
        // y axis
        if(row === game.rows - 1) {
            v.push(game.blank - game.cols);
        } else if(row === 0) {
            v.push(game.blank + game.cols);
        } else {
            v.push(game.blank - game.cols);
            v.push(game.blank + game.cols);
        }
        return v.includes(parseInt(i));
    }

    function checkWin() {
        let check = 0;
        $('.cell').each(function() {
            let elem = $(this),
                i = parseInt(elem.attr('data-index')) + 1,
                k = parseInt(elem.attr('data-key'));
            if(i===k) check++;
            else return false;
        });
        return check === (game.rows*game.cols-1)
    }

    function game_over() {
        alert('Wow! You win! Refresh the page for another image!');
    }

    function generate(length) {
        let data = [];
        // generate sequence
        for(let i=1; i<length ;i++) {
            data.push(i);
        }
        length = data.length;
        // shuffle
        while(length > 1) {
            length--;
            let i = Math.floor(Math.random() * length),
                t = data[length];
            data[length] = data[i];
            data[i] = t;
        }
        return data;
    }

    function draw_cells(key) {
        gs.css({
            width: game.cols * game.cs + 2 + 'px',
            height: game.rows * game.cs + 2 + 'px'
        });

        for(let i=0; i<key.length ;i++) {
            let elem = $('<div class="cell" data-index="'+i+'" data-key="'+key[i]+'" style="' +
                'width:'+ game.cs +'px;' +
                'height:'+ game.cs +'px;' +
                // 'background-image:url('+game.bg+');' +
                // 'background-size:'+(game.cols * game.cs) + 'px ' + (game.rows * game.cs) + 'px' +
                '"><div class="cell-img"></div></div>');
            elem.appendTo(gs);
            moveBg(elem, key[i]-1);
            move(elem, i);
        }
    }

    function draw_solution() {
        let div = $('<div id="solution_wrapper" class="text-center py-5"></div>');
        gi = $('<img id="solution" className="solution" src="'+ game.bg +'" style="' +
            'width:'+ (game.cols * game.cs) +'px;' +
            'height:'+ (game.rows * game.cs) +'px;' +
            '">');
        gi.appendTo(div);
        div.appendTo('#game_wrapper');
    }
    init();
})(jQuery);
