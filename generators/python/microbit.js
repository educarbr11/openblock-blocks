/**
 * Visual Blocks Language
 *
 * Copyright 2021 openblock.cc.
 * https://github.com/openblockcc/openblock-blocks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

goog.provide('Blockly.Python.microbit');

goog.require('Blockly.Python');

Blockly.Python.microbitFieldValueFromNames_ = Blockly.Python.microbitFieldValueFromNames_ || function(block, names, fallback) {
  for (var i = 0; i < names.length; i++) {
    var value = block.getFieldValue(names[i]);
    if (value !== null && value !== undefined) {
      return value;
    }
  }
  return fallback;
};

Blockly.Python.microbitValueOrField_ = Blockly.Python.microbitValueOrField_ || function(block, name, fieldNames, fallback) {
  return Blockly.Python.valueToCode(block, name, Blockly.Python.ORDER_FUNCTION_CALL) ||
      Blockly.Python.microbitFieldValueFromNames_(block, fieldNames.concat([name]), fallback);
};

Blockly.Python.microbitGlobalVariables_ = Blockly.Python.microbitGlobalVariables_ || function() {
  var variablesName = [];
  for (var x in Blockly.Python.variables_) {
    variablesName.push(Blockly.Python.variables_[x].slice(0, Blockly.Python.variables_[x].indexOf('=') - 1));
  }
  return variablesName.length !== 0 ? Blockly.Python.INDENT + "global " + variablesName.join(', ') + "\n" : '';
};

Blockly.Python.microbitIndentedEventBody_ = Blockly.Python.microbitIndentedEventBody_ || function(block) {
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (!nextBlock) {
    return Blockly.Python.INDENT + "pass\n";
  }

  var code = Blockly.Python.microbitGlobalVariables_();
  var body = Blockly.Python.blockToCode(nextBlock);
  if (!body) {
    body = "pass\n";
  }
  return code + Blockly.Python.prefixLines(body, Blockly.Python.INDENT);
};

Blockly.Python.microbitEventFunction_ = Blockly.Python.microbitEventFunction_ || function(block, functionName) {
  var code = "def " + functionName + "():\n";
  return code + Blockly.Python.microbitIndentedEventBody_(block);
};

Blockly.Python['microbit_pin_setDigitalOutput'] = function(block) {
  var pin = Blockly.Python.microbitValueOrField_(block, 'PIN', ['pins'], '0');
  var level = Blockly.Python.valueToCode(block, 'LEVEL', Blockly.Python.ORDER_FUNCTION_CALL) ||
      block.getFieldValue('LEVEL') || '1';

  var code = "pin" + pin + ".write_digital(" + level + ")\n";
  return code;
};

Blockly.Python['microbit_pin_menu_level'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['level', 'LEVEL'], '0');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_pin_setPwmOutput'] = function(block) {
  var pin = Blockly.Python.microbitValueOrField_(block, 'PIN', ['pins'], '0');
  var out = Blockly.Python.valueToCode(block, 'OUT', Blockly.Python.ORDER_FUNCTION_CALL) || '0';

  var code = "pin" + pin + ".write_analog(" + out + ")\n";
  return code;
};

Blockly.Python['microbit_pin_readDigitalPin'] = function(block) {
  var pin = Blockly.Python.microbitValueOrField_(block, 'PIN', ['pins'], '0');
  var code = "pin" + pin + ".read_digital()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_pin_readAnalogPin'] = function(block) {
  var pin = Blockly.Python.microbitValueOrField_(block, 'PIN', ['analogPins'], '0');
  var code = "pin" + pin + ".read_analog()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_pin_pinTouched'] = function(block) {
  var pin = Blockly.Python.microbitValueOrField_(block, 'PIN', ['touchPins'], '0');
  var code = "pin" + pin + ".is_touched()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_display_showImage'] = function(block) {
  var arg0 = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) || '0';

  arg0 = arg0.replace(/1/g, '9');
  arg0 = arg0.slice(0, 5) + ':' + arg0.slice(5, 10) + ':' + arg0.slice(10, 15)
    + ':' + arg0.slice(15, 20) + ':' + arg0.slice(20, 25);
  var code = "display.show(Image('" + arg0 + "'))\n";
  return code;
};

Blockly.Python['microbit_display_showImageUntil'] = function(block) {
  var arg0 = Blockly.Python.valueToCode(block, 'VALUE', Blockly.Python.ORDER_ATOMIC) || '0';
  var arg1 = Blockly.Python.valueToCode(block, 'TIME', Blockly.Python.ORDER_ATOMIC) || '0';

  arg0 = arg0.replace(/1/g, '9');
  arg0 = arg0.slice(0, 5) + ':' + arg0.slice(5, 10) + ':' + arg0.slice(10, 15)
    + ':' + arg0.slice(15, 20) + ':' + arg0.slice(20, 25);
  var code = "display.show(Image('" + arg0 + "'))\n" + "sleep(float(" + arg1 + ") * 1000)\n" + "display.clear()\n";
  return code;
};

Blockly.Python['microbit_display_show'] = function(block) {
  var arg0 = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
  var code = "display.scroll(str(" + arg0 + "), wait=False, loop=False)\n";
  return code;
};

Blockly.Python['microbit_display_showUntilScrollDone'] = function(block) {
  var arg0 = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
  var code = "display.scroll(str(" + arg0 + "), wait=True, loop=False)\n";
  return code;
};

Blockly.Python['microbit_display_clearDisplay'] = function() {
  var code = "display.clear()\n";
  return code;
};

Blockly.Python['microbit_display_lightPixelAt'] = function(block) {
  var sta = Blockly.Python.microbitValueOrField_(block, 'STATE', ['ledState'], 'on');
  var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '';
  var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '';

  if (sta === 'off') {
    sta = 0;
  } else {
    sta = 9;
  }

  var code = "display.set_pixel(int(" + x + "), int(" + y + "), " + sta + ")\n";
  return code;
};

Blockly.Python['microbit_display_showOnPiexlbrightness'] = function(block) {
  var brt = Blockly.Python.valueToCode(block, 'BRT', Blockly.Python.ORDER_FUNCTION_CALL) || '9';
  var x = Blockly.Python.valueToCode(block, 'X', Blockly.Python.ORDER_FUNCTION_CALL) || '';
  var y = Blockly.Python.valueToCode(block, 'Y', Blockly.Python.ORDER_FUNCTION_CALL) || '';

  var code = "display.set_pixel(int(" + x + "), int(" + y + "), " + brt + ")\n";
  return code;
};

Blockly.Python['microbit_display_menu_ledBrightness'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['ledBrightness', 'BRT'], '9');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_buttonIsPressed'] = function(block) {
  var key = Blockly.Python.microbitValueOrField_(block, 'KEY', ['keys'], 'a');

  var code = "button_" + key + ".is_pressed()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_gestureIsX'] = function(block) {
  var sta = Blockly.Python.microbitValueOrField_(block, 'STA', ['gestrues'], 'shake');

  var code = "accelerometer.is_gesture('" + sta + "')";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_axisAcceleration'] = function(block) {
  var axis = Blockly.Python.microbitValueOrField_(block, 'AXIS', ['axis'], 'x');

  var code = "accelerometer.get_" + axis + "()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_compassAngle'] = function() {
  var code = "compass.heading()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_compassMagneticDensity'] = function() {
  var code = "compass.get_field_strength()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_calibrateCompass'] = function() {
  var code = "compass.calibrate()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_lightLevel'] = function() {
  var code = "display.read_light_level()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_temperature'] = function() {
  var code = "temperature()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_sensor_runningTime'] = function() {
  var code = "running_time()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_wireless_openWirelessCommunication'] = function() {
  Blockly.Python.imports_["radio"] = "import radio";
  var code = "radio.on()\n";
  return code;
};

Blockly.Python['microbit_wireless_closeWirelessCommunication'] = function() {
  Blockly.Python.imports_["radio"] = "import radio";
  var code = "radio.off()\n";
  return code;
};

Blockly.Python['microbit_wireless_resetWirelessCommunication'] = function() {
  Blockly.Python.imports_["radio"] = "import radio";
  var code = "radio.reset()\n";
  return code;
};

Blockly.Python['microbit_wireless_sendWirelessMessage'] = function(block) {
  Blockly.Python.imports_["radio"] = "import radio";

  var msg = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
  var code = "radio.send(str(" + msg + "))\n";
  return code;
};

Blockly.Python['microbit_wireless_receiveWirelessMessage'] = function() {
  Blockly.Python.imports_["radio"] = "import radio";
  var code = "radio.receive()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['microbit_wireless_setWirelessCommunicationChannel'] = function(block) {
  Blockly.Python.imports_["radio"] = "import radio";

  var ch = block.getFieldValue('CH');
  var code = "radio.config(channel = " + ch + ")\n";
  return code;
};

Blockly.Python['microbit_console_consolePrint'] = function(block) {
  var msg = Blockly.Python.valueToCode(block, 'TEXT', Blockly.Python.ORDER_FUNCTION_CALL) || '';
  var code = "print(" + msg + ")\n";
  return code;
};

Blockly.Python['microbit_whenMicrobitBegin'] = function(block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  if (!nextBlock) {
    return "pass\n";
  }
  return "";
};

Blockly.Python['microbit_whenButtonPressed'] = function(block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var key = Blockly.Python.microbitValueOrField_(block, 'KEY', ['keys'], 'a');
  var i = '';
  while (Blockly.Python.loops_["microbit_whenButtonPressed" + key + i]) {
    i = i === '' ? 1 : i + 1;
  }

  Blockly.Python.loops_["microbit_whenButtonPressed" + key + i] = "if button_" + key + ".is_pressed():\n" +
    Blockly.Python.INDENT + Blockly.Python.INDENT + "on_button_" + key + i + "()";

  Blockly.Python.libraries_["def on_button_" + key + i] =
    Blockly.Python.microbitEventFunction_(block, "on_button_" + key + i);
  return null;
};

Blockly.Python['microbit_whenPinTouched'] = function(block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var pin = Blockly.Python.microbitValueOrField_(block, 'PIN', ['touchPins'], '0');
  var i = '';
  while (Blockly.Python.loops_["microbit_whenPinTouched" + pin + i]) {
    i = i === '' ? 1 : i + 1;
  }

  Blockly.Python.loops_["microbit_whenPinTouched" + pin + i] = "if pin" + pin + ".is_touched():\n" +
    Blockly.Python.INDENT + Blockly.Python.INDENT + "on_pin" + pin + i + "()";

  Blockly.Python.libraries_["def on_pin" + pin + i] =
    Blockly.Python.microbitEventFunction_(block, "on_pin" + pin + i);
  return null;
};

Blockly.Python['microbit_whenGesture'] = function(block) {
  Blockly.Python.imports_["microbit"] = "from microbit import *";

  var gesture = Blockly.Python.microbitValueOrField_(block, 'STA', ['gestrues'], 'shake');
  var safeGesture = String(gesture).replace(/[^a-z0-9_]/gi, '_');
  var i = '';
  while (Blockly.Python.loops_["microbit_whenGesture" + safeGesture + i]) {
    i = i === '' ? 1 : i + 1;
  }

  Blockly.Python.loops_["microbit_whenGesture" + safeGesture + i] =
    "if accelerometer.was_gesture('" + gesture + "'):\n" +
    Blockly.Python.INDENT + Blockly.Python.INDENT + "on_" + safeGesture + i + "()";

  Blockly.Python.libraries_["def on_" + safeGesture + i] =
    Blockly.Python.microbitEventFunction_(block, "on_" + safeGesture + i);
  return null;
};

Blockly.Python['microbit_setDigitalOutput'] = Blockly.Python['microbit_pin_setDigitalOutput'];
Blockly.Python['microbit_setPwmOutput'] = Blockly.Python['microbit_pin_setPwmOutput'];
Blockly.Python['microbit_readDigitalPin'] = Blockly.Python['microbit_pin_readDigitalPin'];
Blockly.Python['microbit_readAnalogPin'] = Blockly.Python['microbit_pin_readAnalogPin'];
Blockly.Python['microbit_pinTouched'] = Blockly.Python['microbit_pin_pinTouched'];
Blockly.Python['microbit_showImage'] = Blockly.Python['microbit_display_showImage'];
Blockly.Python['microbit_showImageUntil'] = Blockly.Python['microbit_display_showImageUntil'];
Blockly.Python['microbit_show'] = Blockly.Python['microbit_display_show'];
Blockly.Python['microbit_showUntilScrollDone'] = Blockly.Python['microbit_display_showUntilScrollDone'];
Blockly.Python['microbit_clearDisplay'] = Blockly.Python['microbit_display_clearDisplay'];
Blockly.Python['microbit_lightPixelAt'] = Blockly.Python['microbit_display_lightPixelAt'];
Blockly.Python['microbit_showOnPiexlbrightness'] = Blockly.Python['microbit_display_showOnPiexlbrightness'];
Blockly.Python['microbit_buttonIsPressed'] = Blockly.Python['microbit_sensor_buttonIsPressed'];
Blockly.Python['microbit_gestureIsX'] = Blockly.Python['microbit_sensor_gestureIsX'];
Blockly.Python['microbit_axisAcceleration'] = Blockly.Python['microbit_sensor_axisAcceleration'];
Blockly.Python['microbit_compassAngle'] = Blockly.Python['microbit_sensor_compassAngle'];
Blockly.Python['microbit_compassMagneticDensity'] = Blockly.Python['microbit_sensor_compassMagneticDensity'];
Blockly.Python['microbit_calibrateCompass'] = Blockly.Python['microbit_sensor_calibrateCompass'];
Blockly.Python['microbit_lightLevel'] = Blockly.Python['microbit_sensor_lightLevel'];
Blockly.Python['microbit_temperature'] = Blockly.Python['microbit_sensor_temperature'];
Blockly.Python['microbit_runningTime'] = Blockly.Python['microbit_sensor_runningTime'];
Blockly.Python['microbit_openWirelessCommunication'] = Blockly.Python['microbit_wireless_openWirelessCommunication'];
Blockly.Python['microbit_closeWirelessCommunication'] = Blockly.Python['microbit_wireless_closeWirelessCommunication'];
Blockly.Python['microbit_resetWirelessCommunication'] = Blockly.Python['microbit_wireless_resetWirelessCommunication'];
Blockly.Python['microbit_sendWirelessMessage'] = Blockly.Python['microbit_wireless_sendWirelessMessage'];
Blockly.Python['microbit_receiveWirelessMessage'] = Blockly.Python['microbit_wireless_receiveWirelessMessage'];
Blockly.Python['microbit_setWirelessCommunicationChannel'] = Blockly.Python['microbit_wireless_setWirelessCommunicationChannel'];
Blockly.Python['microbit_consolePrint'] = Blockly.Python['microbit_console_consolePrint'];
Blockly.Python['microbit_menu_level'] = Blockly.Python['microbit_pin_menu_level'];
Blockly.Python['microbit_menu_ledBrightness'] = Blockly.Python['microbit_display_menu_ledBrightness'];
Blockly.Python['microbit_menu_pins'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['pins', 'PIN'], '0');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['microbit_menu_analogPins'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['analogPins', 'PIN'], '0');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['microbit_menu_touchPins'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['touchPins', 'PIN'], '0');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['microbit_menu_keys'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['keys', 'KEY'], 'a');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['microbit_menu_gestrues'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['gestrues', 'STA'], 'shake');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['microbit_menu_axis'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['axis', 'AXIS'], 'x');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['microbit_menu_ledState'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['ledState', 'STATE'], 'on');
  return [code, Blockly.Python.ORDER_ATOMIC];
};
Blockly.Python['microbit_menu_channel'] = function(block) {
  var code = Blockly.Python.microbitFieldValueFromNames_(block, ['channel', 'CH'], '0');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['pin_setDigitalOutput'] = Blockly.Python['microbit_pin_setDigitalOutput'];
Blockly.Python['pin_setPwmOutput'] = Blockly.Python['microbit_pin_setPwmOutput'];
Blockly.Python['pin_readDigitalPin'] = Blockly.Python['microbit_pin_readDigitalPin'];
Blockly.Python['pin_readAnalogPin'] = Blockly.Python['microbit_pin_readAnalogPin'];
Blockly.Python['pin_pinTouched'] = Blockly.Python['microbit_pin_pinTouched'];
Blockly.Python['display_showImage'] = Blockly.Python['microbit_display_showImage'];
Blockly.Python['display_showImageUntil'] = Blockly.Python['microbit_display_showImageUntil'];
Blockly.Python['display_show'] = Blockly.Python['microbit_display_show'];
Blockly.Python['display_showUntilScrollDone'] = Blockly.Python['microbit_display_showUntilScrollDone'];
Blockly.Python['display_clearDisplay'] = Blockly.Python['microbit_display_clearDisplay'];
Blockly.Python['display_lightPixelAt'] = Blockly.Python['microbit_display_lightPixelAt'];
Blockly.Python['display_showOnPiexlbrightness'] = Blockly.Python['microbit_display_showOnPiexlbrightness'];
Blockly.Python['sensor_buttonIsPressed'] = Blockly.Python['microbit_sensor_buttonIsPressed'];
Blockly.Python['sensor_gestureIsX'] = Blockly.Python['microbit_sensor_gestureIsX'];
Blockly.Python['sensor_axisAcceleration'] = Blockly.Python['microbit_sensor_axisAcceleration'];
Blockly.Python['sensor_lightLevel'] = Blockly.Python['microbit_sensor_lightLevel'];
Blockly.Python['sensor_temperature'] = Blockly.Python['microbit_sensor_temperature'];
Blockly.Python['sensor_runningTime'] = Blockly.Python['microbit_sensor_runningTime'];
Blockly.Python['wireless_openWirelessCommunication'] = Blockly.Python['microbit_wireless_openWirelessCommunication'];
Blockly.Python['wireless_closeWirelessCommunication'] = Blockly.Python['microbit_wireless_closeWirelessCommunication'];
Blockly.Python['wireless_resetWirelessCommunication'] = Blockly.Python['microbit_wireless_resetWirelessCommunication'];
Blockly.Python['wireless_sendWirelessMessage'] = Blockly.Python['microbit_wireless_sendWirelessMessage'];
Blockly.Python['wireless_receiveWirelessMessage'] = Blockly.Python['microbit_wireless_receiveWirelessMessage'];
Blockly.Python['wireless_setWirelessCommunicationChannel'] = Blockly.Python['microbit_wireless_setWirelessCommunicationChannel'];
Blockly.Python['console_consolePrint'] = Blockly.Python['microbit_console_consolePrint'];
Blockly.Python['pin_menu_level'] = Blockly.Python['microbit_pin_menu_level'];
Blockly.Python['display_menu_ledBrightness'] = Blockly.Python['microbit_display_menu_ledBrightness'];

Blockly.Python['pin_menu_pins'] = Blockly.Python['microbit_menu_pins'];
Blockly.Python['pin_menu_analogPins'] = Blockly.Python['microbit_menu_analogPins'];
Blockly.Python['pin_menu_touchPins'] = Blockly.Python['microbit_menu_touchPins'];
Blockly.Python['sensor_menu_keys'] = Blockly.Python['microbit_menu_keys'];
Blockly.Python['sensor_menu_gestrues'] = Blockly.Python['microbit_menu_gestrues'];
Blockly.Python['sensor_menu_axis'] = Blockly.Python['microbit_menu_axis'];
Blockly.Python['display_menu_ledState'] = Blockly.Python['microbit_menu_ledState'];
Blockly.Python['wireless_menu_channel'] = Blockly.Python['microbit_menu_channel'];

[
  'microbit_setDigitalOutput',
  'microbit_setPwmOutput',
  'microbit_readDigitalPin',
  'microbit_readAnalogPin',
  'microbit_pinTouched',
  'microbit_showImage',
  'microbit_showImageUntil',
  'microbit_show',
  'microbit_showUntilScrollDone',
  'microbit_clearDisplay',
  'microbit_lightPixelAt',
  'microbit_showOnPiexlbrightness',
  'microbit_buttonIsPressed',
  'microbit_gestureIsX',
  'microbit_axisAcceleration',
  'microbit_lightLevel',
  'microbit_temperature',
  'microbit_runningTime',
  'microbit_consolePrint',
  'microbit_pin_setDigitalOutput',
  'microbit_pin_setPwmOutput',
  'microbit_pin_readDigitalPin',
  'microbit_pin_readAnalogPin',
  'microbit_pin_pinTouched',
  'microbit_display_showImage',
  'microbit_display_showImageUntil',
  'microbit_display_show',
  'microbit_display_showUntilScrollDone',
  'microbit_display_clearDisplay',
  'microbit_display_lightPixelAt',
  'microbit_display_showOnPiexlbrightness',
  'microbit_sensor_buttonIsPressed',
  'microbit_sensor_gestureIsX',
  'microbit_sensor_axisAcceleration',
  'microbit_sensor_lightLevel',
  'microbit_sensor_temperature',
  'microbit_sensor_runningTime',
  'microbit_console_consolePrint',
  'pin_setDigitalOutput',
  'pin_setPwmOutput',
  'pin_readDigitalPin',
  'pin_readAnalogPin',
  'pin_pinTouched',
  'display_showImage',
  'display_showImageUntil',
  'display_show',
  'display_showUntilScrollDone',
  'display_clearDisplay',
  'display_lightPixelAt',
  'display_showOnPiexlbrightness',
  'sensor_buttonIsPressed',
  'sensor_gestureIsX',
  'sensor_axisAcceleration',
  'sensor_lightLevel',
  'sensor_temperature',
  'sensor_runningTime',
  'wireless_openWirelessCommunication',
  'wireless_closeWirelessCommunication',
  'wireless_resetWirelessCommunication',
  'wireless_sendWirelessMessage',
  'wireless_receiveWirelessMessage',
  'wireless_setWirelessCommunicationChannel',
  'console_consolePrint'
].forEach(function(name) {
  var generator = Blockly.Python[name];
  if (typeof generator !== 'function' || generator.__dogoblockMicrobitImportWrapped) {
    return;
  }
  var wrapped = function() {
    Blockly.Python.imports_["microbit"] = "from microbit import *";
    return generator.apply(this, arguments);
  };
  wrapped.__dogoblockMicrobitImportWrapped = true;
  Blockly.Python[name] = wrapped;
});

Object.keys(Blockly.Python).forEach(function(name) {
  if (name.indexOf('microbit_') !== 0 || typeof Blockly.Python[name] !== 'function') {
    return;
  }
  var doublePrefixedName = 'microbit_' + name;
  if (!Blockly.Python[doublePrefixedName]) {
    Blockly.Python[doublePrefixedName] = Blockly.Python[name];
  }
});
