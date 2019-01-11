$(document).ready(function () {
    // Initialize gauges
    let sgConfig = liquidFillGaugeDefaultSettings()
    sgConfig.circleColor = "#80e27e"
    sgConfig.textColor = "#80e27e"
    sgConfig.waveTextColor = "#FFF"
    sgConfig.waveColor = "#4CAF50"
    sgConfig.circleThickness = 0.05
    sgConfig.textVertPosition = 0.5
    sgConfig.minValue = 20
    sgConfig.maxValue = 110 // There's no such thing as perfection ;)
    // At an average resting breathing rate of 12 breaths per minute,
    // one breath will last about 5 seconds...
    // ...so let's sync the wave period with that
    sgConfig.waveAnimateTime = 5000
    sgConfig.waveCount = 0.5
    sgConfig.waveHeight = 0.15
    sgConfig.waveOffset = 0.8
    // Get overallSuccessRate from data-value attribute that's filled in by
    // server-side template
    let overallSuccessRate = $('#successgauge').attr('data-value')
    if (isNaN(overallSuccessRate)) { overallSuccessRate = 0; } // Prevent NaN
    let successgauge = loadLiquidFillGauge("successgauge", overallSuccessRate, sgConfig)

    let fgConfig = liquidFillGaugeDefaultSettings()
    fgConfig.circleColor = "#ff7961"
    fgConfig.textColor = "#ff7961"
    fgConfig.waveTextColor = "#FFF"
    fgConfig.waveColor = "#f44336"
    fgConfig.circleThickness = 0.05
    fgConfig.textVertPosition = 0.5
    fgConfig.minValue = 0
    fgConfig.maxValue = 15
    fgConfig.displayPercent = false
    fgConfig.waveCount = 3
    sgConfig.waveHeight = 0.15
    // Animate much slower than the sucess gauge so that it doesn't draw as
    // much attention
    sgConfig.waveAnimateTime = 30000
    fgConfig.waveAnimate = true
    // Get failuresThisMonth from data-value attribute that's filled in by
    // server-side template
    let failuresThisMonth = $('#failuregauge').attr('data-value')
    if (isNaN(failuresThisMonth)) { failuresThisMonth = 0; } // Prevent NaN
    let failuregauge = loadLiquidFillGauge("failuregauge", failuresThisMonth, fgConfig)

    $('#welcome-message').delay(1000).slideDown(800).delay(3000).slideUp(800)

    // Initialize all tooltips (for streak progress bars)
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })

    // Set start date in streak creation form to today
    // This doesn't respect timezones but that's not the end of the world
    $('#createStreakStartDateInput').val(new Date().toJSON().substring(0,10))
    // Initiliaze datepickers
    // Dynamically remove the WebKit default date picker
    // Change to font size here is to ensure that text doesn't get cut off
    // (tested on 13in Macbook)
    // (this is a really hacky thing to do, but it's a bit of a workaround)
    $('.startDateInput').datepicker({
        date: new Date(),
        startDate: new Date(),
        format: 'yyyy-mm-dd',
        weekStart: 1,
    }).css({'-webkit-appearance': 'none', 'font-size': '0.8rem', 'padding': '0.5rem' })
    $('.endDateInput').datepicker({
        date: new Date(),
        startDate: new Date(),
        format: 'yyyy-mm-dd',
        weekStart: 1,
        startView: 1, // Start at month view to encourage long-term goals!
    }).css({'-webkit-appearance': 'none', 'font-size': '0.8rem', 'padding': '0.5rem' })

    // Show the appropriate edit streak form when one of the edit streak buttons
    // is clicked
    $('.streak-form-open').click((e) => {
        const streakId = $(e.target).attr('data-id')
        // Close any other open streak forms
        $('.streak-form[data-id!=' + streakId + ']').slideUp()
        // Show the correct form
        $('.streak-form[data-id=' + streakId + ']').slideToggle()
    })

    // Close the appropriate form when one of the cancel buttons is clicked
    $('.streak-form-close').click((e) => {
        const streakId = $(e.target).attr('data-id')
        // Hide the correct form
        $('.streak-form[data-id=' + streakId + ']').slideToggle()
    })

    // Keep the label next to each frequency input gramatically correct
    $('.frequencyInput').change((e) => {
        // Get new value from this input
        const number = $(e.target).val()

        // Find the label that's next to this particular input
        const label = $(e.target).parent().find('.input-group-text')

        if (number <= 1) {
            label.text('once')
        } else {
            label.text('times')
        }
    })
})
