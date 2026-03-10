/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  Database, 
  Filter, 
  BarChart3, 
  Table as TableIcon, 
  Info,
  ChevronDown,
  Activity,
  Flower2
} from 'lucide-react';
import { parseIrisCSV } from './utils/csvParser';
import { 
  getDescriptiveStats, 
  calculateGroupedFrequency, 
  calculateGroupedStats,
  calculateUngroupedFrequency
} from './utils/statistics';
import { IrisData, IrisAttribute, DescriptiveStats, GroupedStats, FrequencyRow } from './types';
import irisCsv from './iris.csv?raw';

const ATTRIBUTES: { label: string; value: IrisAttribute }[] = [
  { label: 'Comprimento da Sépala', value: 'sepal_length' },
  { label: 'Largura da Sépala', value: 'sepal_width' },
  { label: 'Comprimento da Pétala', value: 'petal_length' },
  { label: 'Largura da Pétala', value: 'petal_width' },
];

const SPECIES = [
  { label: 'Todas as Espécies', value: 'all' },
  { label: 'Iris Setosa', value: 'Iris-setosa' },
  { label: 'Iris Versicolor', value: 'Iris-versicolor' },
  { label: 'Iris Virginica', value: 'Iris-virginica' },
];

export default function App() {
  const [data, setData] = useState<IrisData[]>([]);
  const [selectedAttr, setSelectedAttr] = useState<IrisAttribute>('petal_length');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'raw' | 'grouped'>('raw');

  useEffect(() => {
    const parsed = parseIrisCSV(irisCsv);
    setData(parsed);
  }, []);

  const filteredData = useMemo(() => {
    if (selectedSpecies === 'all') return data;
    return data.filter(d => d.species === selectedSpecies);
  }, [data, selectedSpecies]);

  const numericValues = useMemo(() => {
    return filteredData.map(d => d[selectedAttr]);
  }, [filteredData, selectedAttr]);

  const stats = useMemo(() => getDescriptiveStats(numericValues), [numericValues]);
  
  const groupedFreq = useMemo(() => calculateGroupedFrequency(numericValues), [numericValues]);
  const groupedStats = useMemo(() => calculateGroupedStats(groupedFreq, numericValues.length), [groupedFreq, numericValues.length]);
  
  const ungroupedFreq = useMemo(() => calculateUngroupedFrequency(numericValues), [numericValues]);

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Flower2 className="w-12 h-12 text-[#5A5A40] animate-pulse mx-auto mb-4" />
          <p className="font-serif text-lg text-[#5A5A40]">Carregando dados do dataset Iris...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans p-4 md:p-8">
      <header className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-2"
            >
              <Flower2 className="w-6 h-6 text-[#5A5A40]" />
              <span className="uppercase tracking-widest text-xs font-semibold text-[#5A5A40]/60">TDE: Construção de Algoritmos</span>
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-6xl font-serif font-light leading-tight"
            >
              Laboratório de <br />
              <span className="italic">Estatística Iris</span>
            </motion.h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-[32px] shadow-sm border border-[#5A5A40]/10 flex flex-wrap gap-4"
          >
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40]/60 px-1">Atributo</label>
              <div className="relative">
                <select 
                  value={selectedAttr}
                  onChange={(e) => setSelectedAttr(e.target.value as IrisAttribute)}
                  className="appearance-none bg-[#F5F5F0] border-none rounded-full px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/20 cursor-pointer"
                >
                  {ATTRIBUTES.map(attr => (
                    <option key={attr.value} value={attr.value}>{attr.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A40]/40 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40]/60 px-1">Espécie</label>
              <div className="relative">
                <select 
                  value={selectedSpecies}
                  onChange={(e) => setSelectedSpecies(e.target.value)}
                  className="appearance-none bg-[#F5F5F0] border-none rounded-full px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-[#5A5A40]/20 cursor-pointer"
                >
                  {SPECIES.map(s => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A5A40]/40 pointer-events-none" />
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        {/* Statistics Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Média" value={stats.mean} icon={<Activity className="w-4 h-4" />} />
          <StatCard label="Mediana" value={stats.median} icon={<Activity className="w-4 h-4" />} />
          <StatCard 
            label="Moda" 
            value={stats.mode.length > 3 ? "Múltiplas" : stats.mode.join(', ')} 
            icon={<Activity className="w-4 h-4" />} 
          />
          <StatCard label="Variância" value={stats.variance} icon={<Activity className="w-4 h-4" />} />
          <StatCard label="Desvio Padrão" value={stats.stdDev} icon={<Activity className="w-4 h-4" />} />
        </section>

        {/* Tabs for Analysis */}
        <div className="flex gap-4 border-b border-[#5A5A40]/10 pb-px">
          <button 
            onClick={() => setActiveTab('raw')}
            className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'raw' ? 'text-[#5A5A40]' : 'text-[#5A5A40]/40 hover:text-[#5A5A40]/70'}`}
          >
            Dados Brutos
            {activeTab === 'raw' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A5A40]" />}
          </button>
          <button 
            onClick={() => setActiveTab('grouped')}
            className={`pb-4 px-2 text-sm font-medium transition-all relative ${activeTab === 'grouped' ? 'text-[#5A5A40]' : 'text-[#5A5A40]/40 hover:text-[#5A5A40]/70'}`}
          >
            Dados Agrupados (Classes)
            {activeTab === 'grouped' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5A5A40]" />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'raw' ? (
            <motion.div 
              key="raw"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-[#5A5A40]/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-serif text-2xl">Distribuição de Frequência</h3>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#5A5A40]/40">Dados Não Agrupados</span>
                </div>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ungroupedFreq}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#5A5A40/10" />
                      <XAxis 
                        dataKey="value" 
                        fontSize={10} 
                        tick={{ fill: '#5A5A40' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        fontSize={10} 
                        tick={{ fill: '#5A5A40' }} 
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                      />
                      <Bar dataKey="frequency" fill="#5A5A40" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#5A5A40]/5 overflow-hidden">
                <h3 className="font-serif text-2xl mb-6">Tabela de Frequência</h3>
                <div className="overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-[#5A5A40]/60 border-b border-[#5A5A40]/10">
                        <th className="pb-3 font-bold">Valor</th>
                        <th className="pb-3 font-bold">fi</th>
                        <th className="pb-3 font-bold">fr</th>
                        <th className="pb-3 font-bold">Fac</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5A5A40]/5">
                      {ungroupedFreq.map((row, i) => (
                        <tr key={i} className="hover:bg-[#F5F5F0]/50 transition-colors">
                          <td className="py-3 font-mono">{row.value.toFixed(1)}</td>
                          <td className="py-3">{row.frequency}</td>
                          <td className="py-3">{(row.relativeFrequency * 100).toFixed(1)}%</td>
                          <td className="py-3">{row.cumulativeFrequency}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="grouped"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <StatCard label="Média (Agrupada)" value={groupedStats.mean} icon={<Activity className="w-4 h-4" />} variant="secondary" />
                <StatCard label="Mediana (Agrupada)" value={groupedStats.median} icon={<Activity className="w-4 h-4" />} variant="secondary" />
                <StatCard label="Variância (Agrupada)" value={groupedStats.variance} icon={<Activity className="w-4 h-4" />} variant="secondary" />
                <StatCard label="Desvio Padrão (Agrupada)" value={groupedStats.stdDev} icon={<Activity className="w-4 h-4" />} variant="secondary" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#5A5A40]/5">
                  <h3 className="font-serif text-2xl mb-8">Histograma de Classes</h3>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={groupedFreq}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#5A5A40/10" />
                        <XAxis 
                          dataKey="classRange" 
                          fontSize={9} 
                          tick={{ fill: '#5A5A40' }} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          fontSize={10} 
                          tick={{ fill: '#5A5A40' }} 
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar dataKey="frequency" fill="#5A5A40" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#5A5A40]/5">
                  <h3 className="font-serif text-2xl mb-6">Tabela de Classes (Sturges)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-wider text-[#5A5A40]/60 border-b border-[#5A5A40]/10">
                          <th className="pb-3 font-bold">Classe</th>
                          <th className="pb-3 font-bold">xi (Ponto Médio)</th>
                          <th className="pb-3 font-bold">fi</th>
                          <th className="pb-3 font-bold">fr</th>
                          <th className="pb-3 font-bold">Fac</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#5A5A40]/5">
                        {groupedFreq.map((row, i) => (
                          <tr key={i} className="hover:bg-[#F5F5F0]/50 transition-colors">
                            <td className="py-4 font-mono text-xs">{row.classRange}</td>
                            <td className="py-4">{row.midPoint.toFixed(2)}</td>
                            <td className="py-4">{row.frequency}</td>
                            <td className="py-4">{(row.relativeFrequency * 100).toFixed(1)}%</td>
                            <td className="py-4">{row.cumulativeFrequency}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conclusions Section */}
        <section className="bg-[#5A5A40] text-white rounded-[32px] p-8 md:p-12 shadow-xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 opacity-60" />
              <span className="uppercase tracking-widest text-xs font-semibold opacity-60">Análise e Conclusões</span>
            </div>
            <h2 className="text-4xl font-serif mb-6 italic">Interpretando os Resultados</h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                A análise estatística do dataset Iris revela padrões distintos entre as espécies. 
                Ao observar o <strong>{ATTRIBUTES.find(a => a.value === selectedAttr)?.label}</strong> para 
                <strong> {SPECIES.find(s => s.value === selectedSpecies)?.label}</strong>, notamos uma 
                média de {stats.mean.toFixed(2)} e um desvio padrão de {stats.stdDev.toFixed(2)}.
              </p>
              <p>
                A aplicação da <strong>Regra de Sturges</strong> permitiu a visualização da densidade dos dados em {groupedFreq.length} classes. 
                Isso é fundamental para identificar se a distribuição se aproxima de uma normal ou se apresenta assimetrias significativas, 
                o que auxilia na classificação taxonômica das flores.
              </p>
              <p className="text-sm italic border-l-2 border-white/20 pl-4">
                Nota: Todos os cálculos estatísticos (média, mediana, moda, variância e desvio padrão) foram implementados 
                manualmente, sem o uso de bibliotecas externas de processamento numérico, conforme os requisitos do TDE.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#5A5A40]/10 text-center text-[#5A5A40]/40 text-xs uppercase tracking-[0.2em] pb-8">
        © 2026 Laboratório de Algoritmos • Estatística Descritiva • Dataset Iris
      </footer>
    </div>
  );
}

function StatCard({ label, value, icon, variant = 'primary' }: { label: string; value: string | number; icon: React.ReactNode; variant?: 'primary' | 'secondary' }) {
  const displayValue = typeof value === 'number' ? value.toFixed(3) : value;
  
  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className={`p-6 rounded-[24px] border shadow-sm transition-colors ${
        variant === 'primary' 
          ? 'bg-white border-[#5A5A40]/5' 
          : 'bg-[#F5F5F0] border-[#5A5A40]/10'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-wider font-bold text-[#5A5A40]/50">{label}</span>
        <div className="text-[#5A5A40]/30">{icon}</div>
      </div>
      <div className="text-2xl font-serif text-[#5A5A40]">{displayValue}</div>
    </motion.div>
  );
}
