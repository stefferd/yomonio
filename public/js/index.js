$( document ).ready(function() {
    var $template = $('#template');
    if ($template) {
        $template.on('change', function() {
            var $template = $(this);
            var selectedValue = $template.val();
            $('.templates').css('display', 'none');
            $('#'+selectedValue).css('display', 'block');
        });
    }

    var $notYet = $('#not-yet');
    if ($notYet) {
        $('.trigger-modal').on('click', function() {
            $notYet.attr('style', 'display: block;');
        });
        $notYet.on('click', function(event) {
            var eventTarget = $(event.target);
            console.log(eventTarget);
            if (eventTarget.hasClass('modal-underlay')) {
                $notYet.attr('style', 'display: none;');
            }
        })
    }
});
