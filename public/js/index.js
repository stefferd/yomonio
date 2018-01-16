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

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-64947338-3');

    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:748246,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
});
