import tkinter
import time
import pyautogui

clipboard_content = tkinter.Tk().clipboard_get()
print( clipboard_content.split("\n"))
time.sleep(7)
for i in clipboard_content.split("\n"):
    pyautogui.write(i, interval=0.04)
    pyautogui.press("enter")
    pyautogui.press("home")

print("Working")
i=input()