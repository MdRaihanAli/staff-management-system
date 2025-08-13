import React, { useState, useEffect } from 'react'

const APIDebugger: React.FC = () => {
  const [testResults, setTestResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testEndpoint = async (name: string, url: string) => {
    try {
      console.log(`Testing ${name}:`, url)
      const response = await fetch(url)
      const data = await response.json()
      return { name, status: 'success', data: data, url }
    } catch (error) {
      console.error(`Error testing ${name}:`, error)
      return { name, status: 'error', error: error instanceof Error ? error.message : 'Unknown error', url }
    }
  }

  const runTests = async () => {
    setIsLoading(true)
    setTestResults([])
    
    const tests = [
      ['Test Server', 'http://localhost:3000/api/test'],
      ['Staff API', 'http://localhost:3000/api/staff'],
      ['Hotels API', 'http://localhost:3000/api/hotels'],
      ['Companies API', 'http://localhost:3000/api/companies'],
      ['Departments API', 'http://localhost:3000/api/departments']
    ]

    const results = []
    for (const [name, url] of tests) {
      const result = await testEndpoint(name, url)
      results.push(result)
      setTestResults([...results])
    }
    
    setIsLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Connection Debugger</h1>
        
        <button 
          onClick={runTests}
          disabled={isLoading}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Retest APIs'}
        </button>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div key={index} className={`p-4 rounded-lg ${result.status === 'success' ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{result.name}</h3>
                <span className={`px-2 py-1 rounded text-sm ${result.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {result.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{result.url}</p>
              {result.status === 'success' ? (
                <div className="mt-2">
                  <p className="text-sm text-green-700">✅ Successfully connected</p>
                  <pre className="text-xs bg-green-50 p-2 rounded mt-2 overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="mt-2">
                  <p className="text-sm text-red-700">❌ Connection failed: {result.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default APIDebugger
