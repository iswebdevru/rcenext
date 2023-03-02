ru_to_en_map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'ye', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
    'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f',
    'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': 'yy',
    'ы': 'yyy', 'ь': 'uuu', 'э': 'ee', 'ю': 'yu', 'я': 'ya',
}


def create_group_slug(specialization: str, course: int, index: int, is_commercial: bool):
    return f"{''.join(map(lambda l: ru_to_en_map[l], specialization.lower()))}{'k' if is_commercial else ''}-{course}{index if index > 9 else f'0{index}'}"


def to_readable_group_name(specialization: str, course: int, index: int, is_commercial: bool):
    return f"{specialization}{'к' if is_commercial else ''}-{course}{index if index > 9 else f'0{index}'}"
