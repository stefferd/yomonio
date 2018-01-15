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
});
