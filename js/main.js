let game = {
        cs: 85, // cell size
        rows: 4,
        cols: 4,
        loading: false,
    },
    bgs = 10;
(function ($) {
    let gs = $('#game');
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

    function start() {
        let cells = game.rows * game.cols,
            key = generate(cells);
        game.blank = cells - 1;
        draw_cells(key);
        draw_solution();
        gs.addClass('ready');
    }

    function moveBg(elem, pos) {
        console.log(pos);
        let row = parseInt(pos / game.rows),
            col = pos % game.cols;
        elem.css({
            backgroundPosition: '-' + (col * game.cs) + 'px -' + (row * game.cs) + 'px',
        });
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
        game.bg = 'img/'+ (Math.floor(Math.random() * bgs)) +'.jpg';
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
                'line-height:'+ game.cs +'px;' +
                'background-image:url('+game.bg+');' +
                'background-size:'+(game.cols * game.cs) + 'px ' + (game.rows * game.cs) + 'px' +
                '"></div>');
            elem.appendTo(gs);
            moveBg(elem, key[i]-1);
            move(elem, i);
        }
    }

    function draw_solution() {
        let elem = $('<div class="solution" style="' +
            'width:'+ (game.cols * game.cs) +'px;' +
            'height:'+ (game.rows * game.cs) +'px;' +
            'background-image:url('+game.bg+');' +
            'background-size: cover;' +
            '"></div>');
        elem.appendTo('#game_wrapper');
    }

    start();
})(jQuery);
