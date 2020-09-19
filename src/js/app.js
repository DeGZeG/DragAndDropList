import $ from 'jquery';

$(() => {
    $(document).on('mousedown', '.item', function(event) {
        const curScroll = pageYOffset;
        const curItem = this;
        let curTempPos = 0;
        let items = $('.item').filter((i, item) => {
            if (item === $(curItem)[0]) curTempPos = i;
            return item !== $(curItem)[0];
        });
        let shiftX = event.clientX - curItem.getBoundingClientRect().left;
        let shiftY = event.clientY - curItem.getBoundingClientRect().top;
        $(curItem).css({position: 'absolute', zindex: 1000});
        document.body.append(curItem);
        moveAt(event.pageX, event.pageY);

        let tempElement = document.createElement('div');
        $(tempElement)
            .addClass('item temp')
            .css({
                width: curItem.offsetWidth,
                height: curItem.offsetHeight,
                backgroundColor: 'pink'
            });
        setTemp(curTempPos);
        $('html').scrollTop(curScroll);
        let itemsMiddle = new Array(items.length).fill(0).map((val, i) => items[i].getBoundingClientRect().top + items[i].offsetHeight/2);

        function moveAt(pageX, pageY) {
            curItem.style.left = pageX - shiftX + 'px';
            curItem.style.top = pageY - shiftY + 'px';
        }

        function setTemp(position) {
            curTempPos = position;
            items = items.filter((i, item) => item !== tempElement);
            items.splice(position, 0, tempElement);
            $('.wrapper').html(items);
        }

        function updateState() {
            let curItemEdges = { top: curItem.getBoundingClientRect().top, bottom: curItem.getBoundingClientRect().bottom };

            if (curTempPos !== 0 && curTempPos !== items.length-1) {
                if (curItemEdges.top < itemsMiddle[curTempPos-1]) setTemp(curTempPos-1);
                else if (curItemEdges.bottom > itemsMiddle[curTempPos+1]) setTemp(curTempPos+1);
            }
            else if (curTempPos === 0 && curItemEdges.bottom > itemsMiddle[curTempPos+1]) setTemp(curTempPos+1);
            else if (curTempPos === items.length-1 && curItemEdges.top < itemsMiddle[curTempPos-1]) setTemp(curTempPos-1);

            itemsMiddle = itemsMiddle.map((val, i) => items[i].getBoundingClientRect().top + items[i].offsetHeight/2);
        }

        $(document).on('mousemove', function(event) {
            moveAt(event.pageX, event.pageY);
            updateState();
        });

        $(document).on('mouseup', function() {
            $(document).off('mousemove');
            $(document).off('mouseup');
            $('.temp').html($(curItem).html()).removeAttr('style').removeClass('temp');
            $(curItem).remove();
        });
    });
});