radio.onReceivedNumber(function (receivedNumber) {
    last_signal_strength = radio.receivedPacket(RadioPacketProperty.SignalStrength)
})
datalogger.onLogFull(function () {
    for (let index = 0; index < 4; index++) {
        basic.showString("log full")
        music.play(music.tonePlayable(262, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
})
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    radio_group += 1
    radio.setGroup(radio_group)
    basic.showNumber(radio_group)
})
input.onButtonPressed(Button.A, function () {
    music.playTone(587, music.beat(BeatFraction.Whole))
    logging = true
    basic.showIcon(IconNames.Yes)
})
input.onButtonPressed(Button.B, function () {
    music.playTone(147, music.beat(BeatFraction.Whole))
    logging = false
    basic.showIcon(IconNames.No)
})
input.onLogoEvent(TouchButtonEvent.Touched, function () {
    if (start_time == 0) {
        start_time = input.runningTime()
        music.play(music.tonePlayable(175, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
        music.play(music.tonePlayable(131, music.beat(BeatFraction.Whole)), music.PlaybackMode.UntilDone)
    }
})
let log_delete = 0
let last_signal_strength = 0
let start_time = 0
let logging = false
let radio_group = 0
datalogger.includeTimestamp(FlashLogTimeStampFormat.Milliseconds)
radio_group = 1
radio.setGroup(radio_group)
radio.setTransmitPower(7)
datalogger.setColumnTitles(
"runtime",
"signal strength",
"x",
"y",
"z",
"light",
"sound",
"temperature",
"magnetic force"
)
logging = false
basic.showIcon(IconNames.Heart)
start_time = 0
loops.everyInterval(1000, function () {
    if (input.buttonIsPressed(Button.AB)) {
        log_delete += 1
        if (log_delete == 3) {
            datalogger.deleteLog()
            basic.showIcon(IconNames.Sad)
            log_delete = 0
        }
    } else {
        log_delete = 0
    }
})
loops.everyInterval(500, function () {
    radio.sendNumber(0)
    if (logging) {
        datalogger.log(
        datalogger.createCV("runtime", input.runningTime() - start_time),
        datalogger.createCV("signal strength", last_signal_strength),
        datalogger.createCV("x", input.acceleration(Dimension.X)),
        datalogger.createCV("y", input.acceleration(Dimension.Y)),
        datalogger.createCV("z", input.acceleration(Dimension.Z)),
        datalogger.createCV("light", input.lightLevel()),
        datalogger.createCV("sound", input.soundLevel()),
        datalogger.createCV("temperature", input.temperature()),
        datalogger.createCV("magnetic force", input.magneticForce(Dimension.Strength))
        )
    }
})
