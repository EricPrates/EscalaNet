#!/bin/bash

HOST="plantdesigncriacoes.com.br"
DB="plantd65_bomdebola"

echo "==================================="
echo "TESTE DE LATÊNCIA - BANCO REMOTO"
echo "Host: $HOST"
echo "==================================="
echo ""

# 1. Ping
echo "1. LATÊNCIA DE REDE (ping):"
ping -c 5 $HOST | tail -2 | grep avg
echo ""

# 2. Tempo de conexão TCP
echo "2. TEMPO DE CONEXÃO TCP (porta 3306):"
time nc -zv $HOST 3306 2>&1
echo ""

# 3. Query simples
echo "3. TEMPO DE QUERY (SELECT 1):"
time mysql -h $HOST -u plantd65_userbdb -p$DB_PASS $DB -e "SELECT 1" 2>/dev/null
echo ""

# 4. Query com dados
echo "4. TEMPO DE QUERY (COUNT usuarios):"
time mysql -h $HOST -u plantd65_userbdb -p$DB_PASS $DB -e "SELECT COUNT(*) FROM usuarios" 2>/dev/null
echo ""

# 5. Query complexa
echo "5. TEMPO DE QUERY COMPLEXA (JOIN):"
time mysql -h $HOST -u plantd65_userbdb -p$DB_PASS $DB -e "
SELECT COUNT(*) 
FROM alunos a 
LEFT JOIN nucleos n ON a.nucleo_id = n.id 
LEFT JOIN usuarios u ON n.admin_id = u.id" 2>/dev/null
echo ""

echo "==================================="
echo "TESTE CONCLUÍDO"
echo "==================================="
