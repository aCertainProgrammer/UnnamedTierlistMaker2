import os
from PIL import Image

input_directory = "../champion/"  
output_directory = "./"  

target_size = (80, 80)

if not os.path.exists(output_directory):
    os.makedirs(output_directory)

def normalize_filename(name: str) -> str:
    # Remove apostrophes and spaces
    name = name.replace("'", "").replace(" ", "")

    # Manual mapping overrides (case-insensitive match)
    name_map = {
        "monkeyking": "Wukong",
        "jarvaniv": "Jarvan",
        "monkeyking_0": "Wukong_0",
        "jarvaniv_0": "Jarvan_0"
    }

    key = name.lower()
    if key in name_map:
        return name_map[key]

    # Default formatting: capitalize first, lowercase the rest
    return name[0] + name[1:].lower() if len(name) > 1 else name.upper()

for filename in os.listdir(input_directory):
    if filename.lower().endswith(('png', 'jpg', 'jpeg', 'bmp', 'gif')):
        input_image_path = os.path.join(input_directory, filename)

        img = Image.open(input_image_path)

        resized_img = img.resize(target_size)

        base_name = os.path.splitext(filename)[0]
        normalized_name = normalize_filename(base_name)
        output_image_path = os.path.join(output_directory, f"{normalized_name}.webp")

        resized_img.save(output_image_path, format="WEBP", quality=85)

        print(f"Cropped image saved: {output_image_path}")

print("Cropping completed for all images.")
