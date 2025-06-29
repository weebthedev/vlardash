import React from 'react';
import { Hash, Folder } from 'lucide-react';
import CustomSelect from './CustomSelect';

type Option =
  | { key: string; label: string; type: 'toggle' }
  | { key: string; label: string; type: 'text' }
  | { key: string; label: string; type: 'number' }
  | { key: string; label: string; type: 'role' }
  | { key: string; label: string; type: 'channel', allowed: String[] };

type SettingsTab = {
  name: string;
  options: Option[];
};

export default function SettingsManager({
  config,
  guildId,
  roles,
  channels,
  values,
  onChange,
}: {
  config: SettingsTab[];
  guildId: string;
  roles: any[];
  channels: any[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
}) {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-md">
      <div className="space-y-6">
        {config[0].options.map((option) => (
          <div key={option.key} className="flex items-center justify-between">
            <label className="text-base font-medium">{option.label}</label>

            {/* Toggle */}
            {option.type === 'toggle' && (
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition ${
                  values[option.key] ? 'bg-green-500' : 'bg-gray-600'
                }`}
                onClick={() => onChange(option.key, !values[option.key])}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    values[option.key] ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            )}

            {/* Text */}
            {option.type === 'text' && (
              <input
                type="text"
                className="bg-[#2e2e2e] text-white px-3 py-1.5 rounded-md w-64"
                value={values[option.key] || ''}
                onChange={(e) => onChange(option.key, e.target.value)}
              />
            )}

            {/* Number */}
            {option.type === 'number' && (
              <input
                type="number"
                className="bg-[#2e2e2e] text-white px-3 py-1.5 rounded-md w-32"
                value={values[option.key] || ''}
                onChange={(e) => onChange(option.key, e.target.value)}
              />
            )}

            {/* Role Selector */}
            {option.type === 'role' && (
              <CustomSelect
                value={values[option.key]}
                onChange={(val) => onChange(option.key, val)}
                options={roles
                  .filter((r: any) => !r.managed)
                  .map((r: any) => ({
                    label: r.name,
                    value: r.id,
                    icon: (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: r.color ? `#${r.color.toString(16).padStart(6, '0')}` : '#aaa' }}
                      />
                    ),
                  }))}
                placeholder="Select Role"
              />
            )}

            {/* Channel Selector */}
            {option.type === 'channel' && (
              <CustomSelect
                value={values[option.key]}
                onChange={(val) => onChange(option.key, val)}
                options={
                  channels
                    .sort((a: any, b: any) => a.position - b.position)
                    .reduce((acc: any[], channel: any) => {
                      if (channel.type === 4) {
                        acc.push({
                          label: channel.name,
                          value: `category-${channel.id}`,
                          icon: <Folder size={16} className="text-gray-400 ml-2 fill-gray-400" />,
                          disabled: option.allowed ? !option.allowed.includes("Category") : false
                        });
                      } else {
                        acc.push({
                          label: `${channel.name}`,
                          value: channel.id,
                          icon: <Hash size={16} className="text-gray-400 ml-2" />,
                          disabled: option.allowed ? !option.allowed.includes("Text") : false
                        });
                      }
                      return acc;
                    }, [])
                }
                placeholder="Select Channel"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
