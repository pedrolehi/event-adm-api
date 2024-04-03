export default function slugify(text: string): string {
    return text
        .normalize("NFD") // Normaliza os caracteres unicode para decomposição
        .replace(/[\u0300-\u036f]/g, "") // Remove caracteres acentuados
        .toLowerCase() // Converte para minúsculas
        .trim() // Remove espaços em branco no início e no final
        .replace(/[^a-z0-9]/g, "-") // Substitui qualquer caractere que não seja letra ou número por hífen
        .replace(/-+/g, "-"); // Remove múltiplos hífens consecutivos
}
