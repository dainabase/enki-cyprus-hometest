import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Key, Globe, Shield, Database } from 'lucide-react';
import AIAgentsManager from '@/components/admin/settings/AIAgentsManager';

export default function AdminSettings() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings & Configuration</h1>
        <p className="text-gray-600 mt-2">
          Configure AI agents, API keys, and system settings
        </p>
      </div>
      
      <Tabs defaultValue="ai-agents" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai-agents" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            AI Agents
          </TabsTrigger>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="localization" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Localization
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ai-agents" className="mt-6">
          <AIAgentsManager />
        </TabsContent>
        
        <TabsContent value="api-keys" className="mt-6">
          <div className="text-center text-gray-500 py-12">
            <Key className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">API Keys Management</h3>
            <p>Coming soon - Centralized API key management</p>
          </div>
        </TabsContent>
        
        <TabsContent value="localization" className="mt-6">
          <div className="text-center text-gray-500 py-12">
            <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Localization Settings</h3>
            <p>Coming soon - Multi-language configuration</p>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <div className="text-center text-gray-500 py-12">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Security Configuration</h3>
            <p>Coming soon - Security policies and access control</p>
          </div>
        </TabsContent>
        
        <TabsContent value="database" className="mt-6">
          <div className="text-center text-gray-500 py-12">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Database Management</h3>
            <p>Coming soon - Database health and maintenance</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}