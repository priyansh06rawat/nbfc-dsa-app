import os
from PIL import Image

def main():
    icons_dir = "icons"
    base_icon = os.path.join(icons_dir, "icon-512.png")
    base_icon_1024 = os.path.join(icons_dir, "icon-1024.png")
    
    # Let's check current dimensions of icon-512
    try:
        img = Image.open(base_icon)
        if img.width == 1024:
            print("Renaming base icon to icon-1024.png")
            img.close()
            os.rename(base_icon, base_icon_1024)
        else:
            # Maybe we already renamed it
            pass
    except Exception as e:
        pass
        
    sizes = [48, 72, 96, 128, 144, 152, 192, 256, 384, 512, 1024]
    src_icon = base_icon_1024 if os.path.exists(base_icon_1024) else base_icon
    
    for size in sizes:
        dest = os.path.join(icons_dir, f"icon-{size}.png")
        try:
            img = Image.open(src_icon)
            img = img.resize((size, size), Image.Resampling.LANCZOS)
            img.save(dest, format='PNG')
            print(f"Resized to {size}x{size} and saved to {dest}")
        except Exception as e:
            print(f"Error resizing {size}: {e}")

if __name__ == "__main__":
    main()
