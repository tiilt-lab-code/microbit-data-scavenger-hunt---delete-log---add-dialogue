def on_logo_long_pressed():
    global logging
    logging = False
    basic.show_string("End")
input.on_logo_event(TouchButtonEvent.LONG_PRESSED, on_logo_long_pressed)

def on_sound_loud():
    basic.show_icon(IconNames.NO)
    input.set_sound_threshold(SoundThreshold.LOUD, 255)
input.on_sound(DetectedSound.LOUD, on_sound_loud)

def on_button_pressed_ab():
    global logging
    logging = True
    basic.show_string("Start")
    datalogger.log(datalogger.create_cv("light", input.light_level()))
    datalogger.log(datalogger.create_cv("sound", input.sound_level()))
    datalogger.log(datalogger.create_cv("temperature", input.temperature()))
input.on_button_pressed(Button.AB, on_button_pressed_ab)

direction = 0
logging = False
datalogger.set_column_titles("accelerometer", "light", "rotation", "sound", "temperature")

def on_every_interval():
    if logging:
        datalogger.log(datalogger.create_cv("accelerometer", input.acceleration(Dimension.STRENGTH)))
        serial.write_value("accelerometer", input.acceleration(Dimension.STRENGTH))
        datalogger.log(datalogger.create_cv("rotation", input.rotation(Rotation.ROLL)))
        serial.write_value("rotation", input.rotation(Rotation.ROLL))
        datalogger.log(datalogger.create_cv("light", input.light_level()))
        serial.write_value("light", input.light_level())
        datalogger.log(datalogger.create_cv("sound", input.sound_level()))
        serial.write_value("sound", input.sound_level())
        datalogger.log(datalogger.create_cv("temperature", input.temperature()))
loops.every_interval(500, on_every_interval)

def on_forever():
    global direction
    direction = input.compass_heading()
    if direction < 5 or direction > 355:
        basic.show_string("N")
        music.play_tone(262, music.beat(BeatFraction.BREVE))
basic.forever(on_forever)

def on_forever2():
    if input.light_level() < 60:
        music.set_volume(160)
        music.play_sound_effect(music.builtin_sound_effect(soundExpression.yawn),
            SoundExpressionPlayMode.UNTIL_DONE)
basic.forever(on_forever2)
