Imports Jayrock
Imports Jayrock.Json
Imports Jayrock.JsonRpc
Imports Jayrock.JsonRpc.Web
Imports Jayrock.JsonRpc.JsonRpcMethodAttribute
Imports System.Web
Imports System.Web.Services
Imports System.Web.Script.Serialization
Imports BG.Web.NameSearch.Common
Imports BG.Web.NameSearch.Query.Data.Models
Imports BG.Web.NameSearch.Security

Public Class QueryHandler
	Inherits JsonRpcHandler
	Implements IRequiresSessionState

#Region " RELATIONSHIP DATA PROVIDER "
	''' <summary>
	''' A list of relationship types that impact search results of the name search
	''' </summary>
	''' <param name="AppKey">System making the call in case we need to perform special functions by application</param>
	''' <returns>Results Object with a JSON object set to the Result property</returns>
	''' <remarks></remarks>
	<JsonRpcMethod("getRelationshipTypes")>
	Function GetRelationshipTypes(ByVal AppKey As String) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New Data.Models.LookupDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.GetRelationshipTypes(AppKey)
            	.Message = "getRelationshipTypes executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "GetRelationshipTypes"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
#End Region

#Region " ENTITY DATA PROVIDER "
	<JsonRpcMethod("getEntityName")>
	Function GetEntityName(ByVal AppKey As String, ByVal EntityID As String) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New EntityDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.getEntityName(AppKey, EntityID)
            	.Message = "getEntityName executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "GetEntityName"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "], EntityID = [" & EntityID & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
	
	''' <summary>
	''' Additional details for specified entity
	''' </summary>
	''' <param name="AppKey">System making the call in case we need to perform special functions by application</param>
	''' <param name="EntityID">USERID of entity</param>
	''' <returns></returns>
	''' <remarks></remarks>
	<JsonRpcMethod("getEntityDetails")>
	Function GetEntityDetails(ByVal AppKey As String, ByVal EntityID As String) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New EntityDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.GetEntityDetails(AppKey, EntityID)
            	.Message = "getEntityDetails executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "GetEntityDetails"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "], EntityID = [" & EntityID & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
	
	''' <summary>
	''' Additional details for specified entity
	''' </summary>
	''' <param name="AppKey">System making the call in case we need to perform special functions by application</param>
	''' <param name="EntityID">USERID of entity</param>
	''' <returns></returns>
	''' <remarks></remarks>
	<JsonRpcMethod("getEntityRegCategories")>
	Function GetEntityRegCategories(ByVal AppKey As String, ByVal EntityID As String) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New EntityDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.GetEntityRegCategories(AppKey, EntityID)
            	.Message = "getEntityRegCategories executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "getEntityRegCategories"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "], EntityID = [" & EntityID & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
	
	<JsonRpcMethod("fixName")>
	Function FixName(ByVal AppKey As String, ByVal Name As String, ByVal NameType As EntityDataProvider.NAME_TYPE) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New EntityDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.FixName(AppKey, Name, NameType)
            	.Message = "fixName executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "FixName"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "], Name = [" & Name & "], NameType = [" & NameType.ToString & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
#End Region

#Region " RESULTS DATA PROVIDER "

	''' <summary>
	''' Get a list of entities based on the search value entered and the selected relationshp type
	''' </summary>
	''' <param name="AppKey">System making the call in case we need to perform special functions by application</param>
	''' <param name="SearchValue">An USERID or Name value to search for</param>
	''' <param name="RelationshipTypeList">Search results are returned only for entities which have this relationship type</param>
	''' <param name="PageIndex">The page to fetch records for</param>
	''' <param name="PageSize">The number of records to return for a particular page</param>
	''' <returns>Results Object with a JSON object set to the Result property</returns>
	''' <remarks></remarks>
	<JsonRpcMethod("getBasicSearchDataByRelnType", Idempotent:=True)>
	Function GetBasicSearchDataByRelnType(ByVal AppKey As String, _
                                      	ByVal SearchValue As String, _
                                      	ByVal RelationshipTypeList As Integer, _
                                      	ByVal PageIndex As Integer, _
                                      	ByVal PageSize As Integer) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New ResultsDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.GetBasicSearchDataByRelnType(AppKey, SearchValue, RelationshipTypeList, PageIndex, PageSize)
            	.Message = "getBasicSearchDataByRelnType executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "GetBasicSearchDataByRelnType"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "], SearchValue = [" & SearchValue & "], RelationshipTypeList = [" & RelationshipTypeList & "], PageIndex = [" & PageIndex.ToString & "], PageSize = [" & PageSize.ToString & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
	
	''' <summary>
	''' Get a list of entities based on the search value entered
	''' </summary>
	''' <param name="AppKey">System making the call in case we need to perform special functions by application</param>
	''' <param name="SearchValue">An USERID or Name value to search for</param>
	''' <param name="PageIndex">The page to fetch records for</param>
	''' <param name="PageSize">The number of records to return for a particular page</param>
	''' <returns>Results Object with a JSON object set to the Result property</returns>
	''' <remarks></remarks>
	<JsonRpcMethod("getBasicSearchData", Idempotent:=True)>
	Function GetBasicSearchData(ByVal AppKey As String, _
                            	ByVal SearchValue As String, _
                            	ByVal PageIndex As Integer, _
                            	ByVal PageSize As Integer) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With

    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New ResultsDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.GetBasicSearchData(AppKey, SearchValue, PageIndex, PageSize)
            	.Message = "getBasicSearchData executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "GetBasicSearchData"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "], SearchValue = [" & SearchValue & "], PageIndex = [" & PageIndex.ToString & "], PageSize = [" & PageSize.ToString & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
	
	''' <summary>
	''' Get related entities based on a relationship type and the search value that was specified.
	''' </summary>
	''' <param name="AppKey">System making the call in case we need to perform special functions by application</param>
	''' <param name="EntityID">The USERID to use to find other related entities</param>
	''' <param name="RelationshipTypeList">The relationship type for which to find related entities</param>
	''' <param name="PageIndex">The page to fetch records for</param>
	''' <param name="PageSize">The number of records to return for a particular page</param>
	''' <returns>Results Object with a JSON object set to the Result property</returns>
	''' <remarks></remarks>
	<JsonRpcMethod("getRelatedEntities")>
	Function GetRelatedEntities(ByVal AppKey As String, _
                            	ByVal EntityID As String, _
                            	ByVal RelationshipTypeList As String, _
                            	ByVal PageIndex As Integer, _
                            	ByVal PageSize As Integer) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New ResultsDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.GetRelatedEntities(AppKey, EntityID, RelationshipTypeList, PageIndex, PageSize)
            	.Message = "getRelatedEntities executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "GetRelatedEntities"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "], EntityID = [" & EntityID & "], RelationshipTypeList = [" & RelationshipTypeList & "], PageIndex = [" & PageIndex.ToString & "], PageSize = [" & PageSize.ToString & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
	
	<JsonRpcMethod("getPreloadData")>
	Function getPreloadData(ByVal AppKey As String, ByVal CacheIntervalMinute As Integer, ByVal CurrentHttpContext As HttpContext) As Object
    	Dim Result As New Results
    	With Result
        	.Success = False
        	.Result = Nothing
        	.Message = Nothing
    	End With
    	Dim security As New SecurityDataProvider
    	If security.RequestIsAllowable Then
        	Dim dataProvider As New ResultsDataProvider
        	With Result
            	.Success = True
            	.Result = dataProvider.CacheNamesearchData(AppKey, CacheIntervalMinute, CurrentHttpContext)
            	.Message = "getPreloadData executed successfully."
        	End With
    	Else
        	Dim ec As New BGException.ErrorContext
        	With ec
            	.ClassName = "QueryHandler"
            	.MethodName = "GetPreloadData"
            	.NamespacePath = "QueryHandler"
            	.AdditionalInformation = "RequestIsAllowable = False"
            	.ExceptionObject = New AccessViolationException("Permission denied")
            	.ParametersAndValues = "AppKey = [" & AppKey & "]"
        	End With
        	Result.Message = ec.ExceptionObject.Message
        	Throw New BGException(ec.ExceptionObject, ec)
    	End If
    	Return Result
	End Function
#End Region

End Class