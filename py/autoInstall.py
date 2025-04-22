import subprocess
import os

# Список программ для терминала (и не только)
system_packages = {
    "neovim": True, "firefox": True, "git": True, "htop": True, "curl": True,
    "wget": True, "fish": True, "vim": True, "code": False, "zip": True,
    "mousepad": True, "kitty": True, "thunar": True, "obs-studio": True,
    "sudo": True, "zsh": True, "steam": False, "tmux": True, "mc": True,
    "ranger": True, "fd": True, "fzf": True, "bat": True, "ripgrep": True,
    "tldr": True, "exa": True, "btop": True, "aria2": True, "yt-dlp": True,
    "hyprland": False  # Только AUR
}

# AUR-пакеты (только Arch и Kali с `debtap`)
aur_packages = ["hyprland", "visual-studio-code-bin", "ttf-jetbrains-mono", "zsh-autosuggestions", "zsh-syntax-highlighting"]

# Flatpak-приложения
flatpak_apps = ["com.visualstudio.code", "org.mozilla.firefox"]

# Python-библиотеки
python_packages = ["requests", "numpy", "pandas", "matplotlib", "rich", "typer"]

# Определяем дистрибутив
def get_distro():
    try:
        with open("/etc/os-release") as f:
            data = f.read()
            if "Arch" in data:
                return "arch"
            elif "Kali" in data or "Debian" in data or "Ubuntu" in data:
                return "debian"
    except FileNotFoundError:
        pass
    return "unknown"

DISTRO = get_distro()

# Автоустановка yay (AUR) в Arch и Kali
def install_yay():
    if DISTRO == "arch":
        result = subprocess.run(["which", "yay"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if result.returncode != 0:
            print("[+] Устанавливаю yay в Arch...")
            subprocess.run(["git", "clone", "https://aur.archlinux.org/yay.git"], check=True)
            subprocess.run(["bash", "-c", "cd yay && makepkg -si --noconfirm"], check=True)
            subprocess.run(["rm", "-rf", "yay"])

    elif DISTRO == "debian":
        print("[+] Настраиваю поддержку AUR в Kali...")
        subprocess.run(["sudo", "apt", "install", "-y", "git", "fakeroot", "binutils", "make", "gcc", "pkg-config"], check=True)

        print("[+] Устанавливаю debtap для AUR → DEB...")
        subprocess.run(["git", "clone", "https://aur.archlinux.org/debtap.git"], check=True)
        subprocess.run(["bash", "-c", "cd debtap && makepkg -si --noconfirm"], check=True)
        subprocess.run(["rm", "-rf", "debtap"])

        print("[+] Устанавливаю yay...")
        subprocess.run(["git", "clone", "https://aur.archlinux.org/yay.git"], check=True)
        subprocess.run(["bash", "-c", "cd yay && makepkg -si --noconfirm"], check=True)
        subprocess.run(["rm", "-rf", "yay"])

# Добавление contrib/non-free репозиториев в Kali
def setup_kali_repos():
    if DISTRO == "debian":
        print("[+] Добавляю contrib и non-free репозитории в Kali...")
        with open("/etc/apt/sources.list", "a") as f:
            f.write("\ndeb http://http.kali.org/kali kali-rolling main contrib non-free\n")
        subprocess.run(["sudo", "apt", "update"], check=True)

# Автоустановка Flatpak
def install_flatpak():
    print("[+] Устанавливаю Flatpak...")
    if DISTRO == "arch":
        subprocess.run(["sudo", "pacman", "-S", "--noconfirm", "flatpak"], check=True)
    elif DISTRO == "debian":
        subprocess.run(["sudo", "apt", "install", "-y", "flatpak"], check=True)
    subprocess.run(["flatpak", "remote-add", "--if-not-exists", "flathub", "https://flathub.org/repo/flathub.flatpakrepo"], check=True)

# Установка системного пакета
def install_system_package(pkg, available):
    try:
        if not available:
            print(f"[!] {pkg} отсутствует в репозитории {DISTRO}, пропускаю.")
            return

        if DISTRO == "arch":
            result = subprocess.run(["pacman", "-Qi", pkg], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if result.returncode == 0:
                print(f"[✔] {pkg} уже установлен")
            else:
                print(f"[+] Устанавливаю {pkg} через pacman...")
                subprocess.run(["sudo", "pacman", "-S", "--noconfirm", pkg], check=True)

        elif DISTRO == "debian":
            result = subprocess.run(["dpkg", "-l", pkg], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if result.returncode == 0:
                print(f"[✔] {pkg} уже установлен")
            else:
                print(f"[+] Устанавливаю {pkg} через apt...")
                subprocess.run(["sudo", "apt", "install", "-y", pkg], check=True)

    except Exception as e:
        print(f"[!] Ошибка при установке {pkg}: {e}")

# Установка AUR-пакетов
def install_aur_packages():
    if DISTRO in ["arch", "debian"]:
        for pkg in aur_packages:
            print(f"[+] Устанавливаю {pkg} из AUR...")
            subprocess.run(["yay", "-S", "--noconfirm", pkg], check=True)

# Установка Flatpak-приложений
def install_flatpak_apps():
    for app in flatpak_apps:
        print(f"[+] Устанавливаю {app} через Flatpak...")
        subprocess.run(["flatpak", "install", "-y", app], check=True)

# Установка Python-библиотек
def install_python_package(pkg):
    try:
        subprocess.run(["pip", "install", pkg], check=True)
        print(f"[✔] Установлен {pkg}")
    except Exception as e:
        print(f"[!] Ошибка при установке {pkg}: {e}")

if __name__ == "__main__":
    print(f"🔹 Определён дистрибутив: {DISTRO}")

    install_yay()
    if DISTRO == "debian":
        setup_kali_repos()

    install_flatpak()

    print("\n🔹 Устанавливаю системные пакеты...")
    for pkg, available in system_packages.items():
        install_system_package(pkg, available)

    if DISTRO in ["arch", "debian"]:
        install_aur_packages()

    install_flatpak_apps()

    print("\n🔹 Устанавливаю Python-библиотеки...")
    for pkg in python_packages:
        install_python_package(pkg)

    print("\n✅ Установка завершена!")
