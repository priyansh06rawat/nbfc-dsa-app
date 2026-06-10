import os
from PIL import Image, ImageDraw, ImageFont

def resize_icon(src, size, dest):
    try:
        img = Image.open(src)
        img = img.resize((size, size), Image.Resampling.LANCZOS)
        img.save(dest, format='PNG')
        print(f"Resized {src} to {size}x{size} and saved to {dest}")
    except Exception as e:
        print(f"Error resizing {src} to {dest}: {e}")

def create_screenshot(dest, text, size=(1080, 1920), bg_color="#070B18", fg_color="#6C63FF"):
    try:
        img = Image.new('RGB', size, color=bg_color)
        draw = ImageDraw.Draw(img)
        # Try to use default font, but scale it by drawing multiple times or just using it
        try:
            # Not having a proper font might be tiny, but it's just a placeholder screenshot
            font = ImageFont.load_default()
        except:
            font = None
        
        # We can also paste the icon in the center
        icon = Image.open('icons/icon-512.png')
        icon_pos = ((size[0] - icon.width) // 2, (size[1] - icon.height) // 2 - 200)
        img.paste(icon, icon_pos, mask=icon if icon.mode == 'RGBA' else None)
        
        draw.text((size[0]//2 - 100, size[1]//2 + 200), text, fill=fg_color)
        
        img.save(dest, format='PNG')
        print(f"Created screenshot {dest}")
    except Exception as e:
        print(f"Error creating screenshot {dest}: {e}")

def main():
    icons_dir = "icons"
    screenshots_dir = "screenshots"
    
    if not os.path.exists(screenshots_dir):
        os.makedirs(screenshots_dir)
        
    base_icon = os.path.join(icons_dir, "icon-512.png")
    
    sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    
    # Save base icon to itself to ensure it's a valid PNG and not just renamed
    try:
        img = Image.open(base_icon)
        img.save(base_icon, format='PNG')
        print("Re-saved base icon.")
    except Exception as e:
        print(f"Error saving base icon: {e}")
        
    for size in sizes:
        dest = os.path.join(icons_dir, f"icon-{size}.png")
        if dest != base_icon:
            resize_icon(base_icon, size, dest)

    create_screenshot(os.path.join(screenshots_dir, "screen1.png"), "FinFlow NBFC Dashboard")
    create_screenshot(os.path.join(screenshots_dir, "screen2.png"), "DSA & Partner Onboarding")

if __name__ == "__main__":
    main()
