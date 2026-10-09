import React from 'react';
import { SocialPlatformId } from '../../types';
import { PLATFORMS } from '../../lib/platforms';
import { PlatformIcon } from '../../components/PlatformIcon';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Plus, Trash2, Globe } from 'lucide-react';

interface LinkItemState {
  id: string;
  platform: SocialPlatformId;
  label: string;
  url: string;
}

interface Step5LinksProps {
  links: LinkItemState[];
  onChangeLinks: (links: LinkItemState[]) => void;
}

export const Step5Links: React.FC<Step5LinksProps> = ({ links, onChangeLinks }) => {
  const handleUpdate = (id: string, field: 'label' | 'url', val: string) => {
    onChangeLinks(
      links.map((link) => (link.id === id ? { ...link, [field]: val } : link))
    );
  };

  const handleRemove = (id: string) => {
    onChangeLinks(links.filter((link) => link.id !== id));
  };

  const handleAddCustom = () => {
    const newId = 'custom-' + Date.now();
    onChangeLinks([
      ...links,
      {
        id: newId,
        platform: 'custom',
        label: 'My Website',
        url: 'https://',
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-['Michroma',sans-serif] text-lg sm:text-xl text-[#e9f2f9]">
          ATTACH YOUR HYPERLINKS
        </h2>
        <p className="text-xs sm:text-sm font-['Manrope',sans-serif] text-[#9fb4c7] mt-1">
          Enter the handles or URLs for each platform. When visitors click your node, they will be directed here.
        </p>
      </div>

      <div className="flex flex-col gap-4 max-h-[360px] overflow-y-auto pr-1">
        {links.map((link, idx) => {
          const config = PLATFORMS.find((p) => p.id === link.platform);
          const platformName = config ? config.name : 'Custom Link';

          return (
            <div
              key={link.id}
              className="p-4 bg-[#061424] border border-[#173654] rounded-sm flex flex-col gap-3 relative group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#173654]/40 flex items-center justify-center text-[#00d6c8]">
                    <PlatformIcon platform={link.platform} size={14} />
                  </div>
                  <span className="text-xs font-['Oswald',sans-serif] uppercase tracking-wider text-[#e9f2f9] font-bold">
                    {platformName}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(link.id)}
                  className="text-[#9fb4c7]/40 hover:text-[#ff4d4d] transition-colors p-1"
                  title="Remove link"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Button Text / Label"
                  placeholder={config?.name || 'Link Name'}
                  value={link.label}
                  onChange={(e) => handleUpdate(link.id, 'label', e.target.value)}
                />
                <Input
                  label="Destination URL"
                  placeholder={config?.placeholder || 'https://...'}
                  value={link.url}
                  onChange={(e) => handleUpdate(link.id, 'url', e.target.value)}
                  leftAddon={<Globe size={14} />}
                />
              </div>
            </div>
          );
        })}

        {links.length === 0 && (
          <div className="p-6 border border-dashed border-[#173654] rounded text-center text-[#9fb4c7] text-xs">
            No links added yet. Click below to add a link.
          </div>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAddCustom}
        leftIcon={<Plus size={16} />}
        className="w-full"
      >
        + Add Another Custom Link
      </Button>
    </div>
  );
};
