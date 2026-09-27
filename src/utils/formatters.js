export function formatarData(iso) {
    const [ano, mes, dia] = iso.split('-');
    return `${dia}/${mes}/${ano}`;
  }
  
  export function calcularIdade(iso) {
    const [ano, mes, dia] = iso.split('-').map(Number);
    const hoje = new Date();
    let idade = hoje.getFullYear() - ano;
    const mesAtual = hoje.getMonth() + 1;
  
    if (mesAtual < mes || (mesAtual === mes && hoje.getDate() < dia)) {
      idade--;
    }
  
    return idade;
  }
  
  export function iniciais(nome, sobrenome) {
    return `${nome?.[0] ?? ''}${sobrenome?.[0] ?? ''}`.toUpperCase();
  }